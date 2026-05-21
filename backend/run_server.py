
import uvicorn

if __name__ == "__main__":
    print("Starting TruthCheck AI Backend...")
    print("Server will be available at http://127.0.0.1:8000")
    print("API docs at http://127.0.0.1:8000/docs")
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
