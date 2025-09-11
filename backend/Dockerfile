FROM python:3.12-slim

# System dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    curl \
    pkg-config \
    build-essential \ 
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# --- Install Poetry 2.0.1 ---
ENV POETRY_VERSION=2.0.1
RUN curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION
ENV PATH="/root/.local/bin:$PATH"

# Set working directory
WORKDIR /code

# Copy Poetry project files
COPY pyproject.toml poetry.lock* ./

# Install dependencies without virtualenvs
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

# Copy app code
COPY . .

# Run Django
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]