import asyncio
import aiohttp
import time
import json
import statistics

BASE_URL = "http://localhost:5000/run"
CONCURRENCY = 50                            # Number of simultaneous workers
TOTAL_REQUESTS = 3000                       # Total number of requests
TIMEOUT = 15                                # Per request timeout (s)
LANGUAGES = ["python", "javascript", "c", "cpp", "java"]

SAMPLES = {
    "python": 'print(sum(range(100)))',
    "javascript": 'console.log(2 + 2)',
    "c": '#include <stdio.h>\nint main(){printf("%d\\n", 2+2);}',
    "cpp": '#include <iostream>\nint main(){std::cout << 2+2 << std::endl;}',
    "java": 'class Main { public static void main(String[] a){ System.out.println(2+2); } }'
}

results = []

async def worker(idx, session, queue):
    while True:
        try:
            req_id = queue.get_nowait()
        except asyncio.QueueEmpty:
            return
        lang = LANGUAGES[req_id % len(LANGUAGES)]
        payload = {"language": lang, "code": SAMPLES[lang]}
        start = time.perf_counter()
        try:
            async with session.post(BASE_URL, json=payload, timeout=TIMEOUT) as resp:
                elapsed = time.perf_counter() - start
                ok = resp.status == 200
                data = await resp.text()
                results.append({
                    "id": req_id,
                    "lang": lang,
                    "status": resp.status,
                    "ok": ok,
                    "elapsed": elapsed,
                    "output_snippet": data[:150]
                })
        except Exception as e:
            elapsed = time.perf_counter() - start
            results.append({
                "id": req_id,
                "lang": lang,
                "status": None,
                "ok": False,
                "elapsed": elapsed,
                "error": str(e)
            })
        finally:
            queue.task_done()

async def main():
    queue = asyncio.Queue()
    for i in range(TOTAL_REQUESTS):
        queue.put_nowait(i)

    timeout = aiohttp.ClientTimeout(total=None)
    connector = aiohttp.TCPConnector(limit=0)
    async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
        tasks = [asyncio.create_task(worker(i, session, queue)) for i in range(CONCURRENCY)]
        start = time.perf_counter()
        await queue.join()
        total_time = time.perf_counter() - start
        for t in tasks:
            t.cancel()

    # ---- Summary ----
    latencies = [r["elapsed"] for r in results if r.get("elapsed")]
    success = [r for r in results if r.get("ok")]
    errors = [r for r in results if not r.get("ok")]
    total = len(results)
    throughput = total / total_time if total_time else 0

    def pct(p):
        if not latencies:
            return 0
        lat_sorted = sorted(latencies)
        idx = int(len(lat_sorted) * (p / 100))
        return lat_sorted[min(idx, len(lat_sorted) - 1)]

    summary = {
        "total_requests": total,
        "success": len(success),
        "errors": len(errors),
        "error_rate_%": round(len(errors) / total * 100, 2) if total else 0,
        "total_time_s": round(total_time, 2),
        "throughput_rps": round(throughput, 2),
        "latency_mean_s": round(statistics.mean(latencies), 3) if latencies else None,
        "latency_p50_s": round(pct(50), 3),
        "latency_p90_s": round(pct(90), 3),
        "latency_p99_s": round(pct(99), 3)
    }

    print("\n=== CodeOrb Stress Test Summary ===")
    for k, v in summary.items():
        print(f"{k:20}: {v}")
    with open("codeorb_results.json", "w") as f:
        json.dump({"summary": summary, "results": results}, f, indent=2)
    print("Saved detailed results to codeorb_results.json")

if __name__ == "__main__":
    asyncio.run(main())
