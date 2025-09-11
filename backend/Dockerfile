# Builder stage
FROM python:3.12-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc default-libmysqlclient-dev libmariadb3 curl pkg-config build-essential redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_VERSION=2.0.1
RUN curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /code
COPY pyproject.toml poetry.lock* ./

# Install poetry plugin
RUN poetry self add poetry-plugin-export

# Install all dependencies (main + dev)
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi \
    && poetry export -f requirements.txt --without-hashes -o requirements.txt \
    && pip install --no-cache-dir --target=/install -r requirements.txt \
    && rm requirements.txt

COPY . .

# Runtime stage (production)
FROM python:3.12-slim AS runtime
WORKDIR /code
COPY --from=builder /install /usr/local/lib/python3.12/site-packages
COPY --from=builder /code .
RUN apt-get update && apt-get install -y --no-install-recommends libmariadb3 redis-tools && rm -rf /var/lib/apt/lists/*
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# CI stage (for tests)
FROM builder AS ci
WORKDIR /code
CMD ["pytest"]
