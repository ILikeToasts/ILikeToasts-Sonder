import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

app = Celery("backend")

# Use Django settings
app.config_from_object("django.conf:settings", namespace="CELERY")

# Autodiscover tasks.py in all installed apps
app.autodiscover_tasks()
