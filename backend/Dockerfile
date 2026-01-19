FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 🔧 System deps for mysqlclient
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static (safe)
RUN python manage.py collectstatic --noinput || true

# Run migrations + superuser + server
CMD python manage.py migrate && \
    python manage.py create_default_superuser && \
    gunicorn JobSeeker.wsgi:application --bind 0.0.0.0:8000
