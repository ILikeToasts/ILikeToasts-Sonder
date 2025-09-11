FROM python:3.12-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    curl \
    pkg-config \
    build-essential \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_VERSION=2.0.1
RUN curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /code
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --only main \
    && poetry export -f requirements.txt --without-hashes -o requirements.txt \
    && pip install --no-cache-dir --target=/install -r requirements.txt \
    && rm requirements.txt

COPY . .

# Final stage
FROM python:3.12-slim

WORKDIR /code

# Runtime dependencies
COPY --from=builder /install /usr/local/lib/python3.12/site-packages
COPY --from=builder /code .

# Redis
RUN apt-get update && apt-get install -y --no-install-recommends redis-tools \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

# Run Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]