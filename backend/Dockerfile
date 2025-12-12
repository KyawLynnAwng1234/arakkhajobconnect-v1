# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project
COPY . .
# Collect static files
RUN python manage.py collectstatic --noinput

#
# Render will inject PORT environment variable
EXPOSE 10000

# Run Gunicorn using Render's PORT
CMD ["bash", "-c", "python manage.py migrate --noinput && gunicorn JobSeeker.wsgi:application --bind 0.0.0.0:$PORT --workers 3"]

