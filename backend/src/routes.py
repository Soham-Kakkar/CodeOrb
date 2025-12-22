from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.tasks import run_code

router = APIRouter()

class RunRequest(BaseModel):
    code: str
    language: str

@router.get("/")
def home():
    return {"message": "CodeOrb API is live!"}

@router.post("/run")
def run(request: RunRequest):
    if not request.code or not request.language:
        raise HTTPException(status_code=400, detail="Missing code or language")

    task = run_code.apply_async(args=[request.code, request.language])

    try:
        result = task.get(timeout=10)
        return {"output": result.get("output"), "error": result.get("error")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed or timed out: {str(e)}")
