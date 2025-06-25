from src import celery
import docker
import tempfile
import os
import traceback
import shutil

LANGUAGE_CONFIGS = {
    "python": {
        "image": "python:3.11-slim",
        "file_ext": ".py",
        "command": lambda filename: ["python3", filename],
    },
    "c": {
        "image": "gcc:latest",
        "file_ext": ".c",
        "command": lambda filename: ["sh", "-c", f"gcc {filename} -o out && ./out"],
    },
    "cpp": {
        "image": "gcc:latest",
        "file_ext": ".cpp",
        "command": lambda filename: ["sh", "-c", f"g++ {filename} -o out && ./out"],
    },
    "node": {
        "image": "node:20-slim",
        "file_ext": ".js",
        "command": lambda filename: ["node", filename],
    },
    "java": {
        "image": "openjdk:21-slim",
        "file_ext": ".java",
        "command": lambda filename: ["sh", "-c", f"javac {filename} && java -cp . Main"],
    },
}

@celery.task(bind=True, name="src.tasks.run_code")
def run_code(self, code, language):
    if language not in LANGUAGE_CONFIGS:
        return {"output": None, "error": f"Unsupported language: {language}"}

    config = LANGUAGE_CONFIGS[language]
    filename = f"Main{config['file_ext']}" if language == "java" else f"code{config['file_ext']}"

    temp_dir = tempfile.mkdtemp(prefix="codeorb_")
    file_path = os.path.join(temp_dir, filename)

    try:
        # STEP 1: Write user code to file
        with open(file_path, "w") as f:
            f.write(code)

        # STEP 2: Run inside Docker container
        client = docker.from_env()
        result = client.containers.run(
            image=config["image"],
            command=config["command"](filename),
            volumes={temp_dir: {"bind": "/code", "mode": "rw"}},
            working_dir="/code",
            remove=True,
            network_disabled=True,
            mem_limit="100m",
            stdout=True,
            stderr=True,
            cpu_period=100000,
            cpu_quota=50000,
        )

        return {"output": result.decode("utf-8"), "error": None}

    except docker.errors.ContainerError as e:
        return {
            "output": None,
            "error": e.stderr.decode("utf-8") if hasattr(e, "stderr") and e.stderr else str(e),
        }

    except docker.errors.DockerException as e:
        return {"output": None, "error": f"Docker error: {str(e)}"}

    except Exception as e:
        return {
            "output": None,
            "error": f"Unexpected error: {str(e)}\nTrace:\n{traceback.format_exc()}",
        }

    finally:
        # STEP 3: Clean up temp dir
        try:
            shutil.rmtree(temp_dir)
        except Exception as cleanup_error:
            print(f"[!] Cleanup failed: {cleanup_error}")
