# Stage 1: Build the application
FROM python:3.10-slim AS builder

WORKDIR /app

# Install poetry (if using poetry for dependency management)
# RUN pip install poetry
# COPY poetry.lock pyproject.toml /app/
# RUN poetry install --no-dev

# If using requirements.txt
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code into the builder stage
COPY ./appcore /app/appcore

# Stage 2: Production image
FROM python:3.10-slim

WORKDIR /app

# Copy dependencies from builder stage
# If using poetry:
# COPY --from=builder /app/.venv /.venv
# ENV PATH="/app/.venv/bin:$PATH"
# If using requirements.txt:
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin/uvicorn /usr/local/bin/uvicorn


# Copy the application code from the current directory to /app in the container
COPY ./appcore /app/appcore

# Expose the port the app runs on
EXPOSE 8000

# Set Hugging Face specific PORT if not already set by HF Spaces
ENV PORT=${PORT:-8000}
ENV PYTHONUNBUFFERED=1

# Command to run the application
# Adjust if your FastAPI app instance is located elsewhere, e.g., appcore.main:app
# For now, assuming main.py at root instantiates app from appcore.main
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$PORT"]
# If main.py is inside appcore:
CMD ["uvicorn", "appcore.main:app", "--host", "0.0.0.0", "--port", "$PORT"]
