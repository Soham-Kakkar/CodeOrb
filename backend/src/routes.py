from fastapi import APIRouter, status
from pydantic import BaseModel, Field
from src.tasks import run_code

router = APIRouter()

class RunRequest(BaseModel):
    code: str = Field(min_length=1)
    language: str = Field(min_length=1)

@router.get("/")
def home():
    return {"message": "CodeOrb API is live!"}

@router.post("/run", status_code=status.HTTP_202_ACCEPTED)
def run(request: RunRequest):
    task = run_code.apply_async(args=[request.code, request.language])
    return {"task_id": task.id, "status": "PENDING"}


@router.get("/run/{task_id}")
def run_status(task_id: str):
    result = run_code.AsyncResult(task_id)
    response = {"task_id": task_id, "status": result.state}

    if result.successful() and isinstance(result.result, dict):
        response.update(result.result)
    elif result.failed():
        response["error"] = "Execution failed"

    return response
