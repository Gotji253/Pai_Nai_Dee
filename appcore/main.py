from fastapi import FastAPI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Pai Nai Dee API", version="0.1.0")

@app.get("/")
async def read_root():
    """
    Root endpoint for the API.
    Returns a welcome message.
    """
    return {"message": "Welcome to Pai Nai Dee API!"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    Returns the status of the API.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
