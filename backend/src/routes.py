import os
from flask import request, jsonify, send_from_directory
from src import app, celery
from src.tasks import run_code

@app.route('/')
def home():
    return 'CodeOrb API is live!'

@app.route('/docs')
def docs():
    return send_from_directory("./docs", "index.html")

@app.route("/run", methods=["POST"])
def run():
    data = request.get_json()
    code = data.get("code")
    language = data.get("language")

    if not code or not language:
        return jsonify({"error": "Missing code or language"}), 400

    task = run_code.apply_async(args=[code, language])

    try:
        result = task.get(timeout=10)  # seconds
        return jsonify({"output": result.get("output"), "error": result.get("error")})
    except Exception as e:
        return jsonify({"error": f"Execution failed or timed out: {str(e)}"}), 500