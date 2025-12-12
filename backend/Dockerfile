FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (use 8080 for Fly.io, 8000 for other platforms)
# Platform will override via $PORT environment variable
EXPOSE 8080

# Run the application
# Port will be overridden by $PORT env var on most platforms
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
