from celery import Celery

def make_celery():
    celery = Celery(
        "tasks",
        broker="redis://localhost:6379/0",
        backend="redis://localhost:6379/0"
    )
    celery.conf.update(
        task_track_started=True,
        result_expires=3600,
        task_serializer="json",
        result_serializer="json",
        accept_content=["json"],
    )
    return celery

celery = make_celery()
