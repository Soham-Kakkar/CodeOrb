import asyncio
import aiohttp
import time
import json
import statistics

BASE_URL = "http://localhost:5000/run"
TOTAL_REQUESTS = 3000                     # Total number of requests per test
RATES = [10, 20, 30, 40, 50, 60]          # Offered request rates
TIMEOUT = 15                              # HTTP request timeout (s)
POLL_INTERVAL = 0.1                       # Polling interval (s)
LANGUAGES = ["python", "javascript", "c", "cpp", "java"]

SAMPLES = {
    "python": 'print(sum(range(100)))',
    "javascript": 'console.log(2 + 2)',
    "c": '#include <stdio.h>\nint main(){printf("%d\\n", 2+2);}',
    "cpp": '#include <iostream>\nint main(){std::cout << 2+2 << std::endl;}',
    "java": 'class Main { public static void main(String[] a){ System.out.println(2+2); } }'
}

def percentile(values, p):
    if not values:
        return None
    values = sorted(values)
    # Nearest-rank percentile
    index = max(0, min(len(values)-1, int((p / 100) * len(values))))
    return values[index]

async def run_request(req_id, session):
    lang = LANGUAGES[req_id % len(LANGUAGES)]
    payload = {"language": lang, "code": SAMPLES[lang]}
    start = time.perf_counter()
    try:
        # Submit execution
        async with session.post(BASE_URL, json=payload, timeout=TIMEOUT) as resp:
            data = await resp.json()
        if resp.status != 202 or "task_id" not in data:
            raise RuntimeError(f"Submission failed: {resp.status} {data}")
        task_id = data["task_id"]
        # Poll until execution finishes
        while True:
            async with session.get(f"{BASE_URL}/{task_id}", timeout=TIMEOUT) as status_resp:
                status_data = await status_resp.json()
            task_status = status_data.get("status")
            if task_status == "SUCCESS":
                break
            if task_status == "FAILURE":
                raise RuntimeError("Execution failed")
            await asyncio.sleep(POLL_INTERVAL)
        elapsed = time.perf_counter() - start
        container_time = status_data.get("container_time")
        overhead = (elapsed - container_time if container_time is not None else None)
        return {
            "id": req_id,
            "lang": lang,
            "status": status_resp.status,
            "ok": True,
            "elapsed": elapsed,
            "container_time": container_time,
            "overhead": overhead,
            "output_snippet": str(status_data)[:150]
        }

    except Exception as e:
        elapsed = time.perf_counter() - start
        return {
            "id": req_id,
            "lang": lang,
            "status": None,
            "ok": False,
            "elapsed": elapsed,
            "container_time": None,
            "overhead": None,
            "error": str(e)
        }

async def submit_requests(session, offered_rate):
    tasks = []
    interval = 1 / offered_rate
    start = time.perf_counter()
    for req_id in range(TOTAL_REQUESTS):
        tasks.append(asyncio.create_task(run_request(req_id, session)))
        next_submit = start + (req_id + 1) * interval
        delay = next_submit - time.perf_counter()
        if delay > 0:
            await asyncio.sleep(delay)
    return tasks, start

async def run_test(session, offered_rate):
    tasks, start_time = await submit_requests(session, offered_rate)
    results = await asyncio.gather(*tasks)
    total_time = time.perf_counter() - start_time

    # ---- Summary ----
    success = [r for r in results if r.get("ok")]
    errors = [r for r in results if not r.get("ok")]

    latencies = [r["elapsed"] for r in success]
    container_times = [r["container_time"] for r in success if r.get("container_time") is not None]
    overheads = [r["overhead"] for r in success if r.get("overhead") is not None]

    total = len(results)

    completed_throughput = (
        len(success) / total_time
        if total_time
        else 0
    )

    summary = {
        "total_requests": total,
        "success": len(success),
        "errors": len(errors),
        "error_rate_%": round(len(errors) / total * 100, 2) if total else 0,
        "offered_rate_rps": offered_rate,
        "completed_throughput_rps": round(completed_throughput, 2),
        "total_time_s": round(total_time, 2),

        # End-to-end completion latency
        "latency_mean_s": round(statistics.mean(latencies), 3) if latencies else None,
        "latency_p50_s": round(percentile(latencies, 50), 3) if latencies else None,
        "latency_p90_s": round(percentile(latencies, 90), 3) if latencies else None,
        "latency_p99_s": round(percentile(latencies, 99), 3) if latencies else None,

        # Docker execution-stage time
        "container_time_p50_s": round(percentile(container_times, 50), 3) if container_times else None,

        # Service overhead = end-to-end latency - container stage
        "service_overhead_mean_s": round(statistics.mean(overheads), 3) if overheads else None,
        "service_overhead_p50_s": round(percentile(overheads, 50), 3) if overheads else None,
        "service_overhead_p90_s": round(percentile(overheads, 90), 3) if overheads else None,
        "service_overhead_p99_s": round(percentile(overheads, 99), 3) if overheads else None,
    }

    return summary, results

async def main():
    all_results = {}

    timeout = aiohttp.ClientTimeout(total=None)
    connector = aiohttp.TCPConnector(limit=0)

    async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
        for rate in RATES:
            print(f"\n=== Testing {rate} requests/sec ===")
            summary, results = await run_test(session, rate)
            all_results[rate] = {
                "summary": summary,
                "results": results
            }

            for k, v in summary.items():
                print(f"{k:30}: {v}")

    with open("codeorb_results.json", "w") as f:
        json.dump(all_results, f, indent=2)

    print("\nSaved detailed results to codeorb_results.json")

if __name__ == "__main__":
    asyncio.run(main())