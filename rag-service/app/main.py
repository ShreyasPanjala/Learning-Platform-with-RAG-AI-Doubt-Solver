from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import health, documents, chat

app = FastAPI(
    title="RAG AI Doubt Solver Service",
    description="Python FastAPI Service for PDF document processing, embeddings, Pinecone vector search, and Groq LLM grounded answering.",
    version="1.0.0",
)

# Enable CORS for development and internal service calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health.router)
app.include_router(documents.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {
        "service": "RAG AI Doubt Solver Service",
        "status": "running",
        "health_check": "/health"
    }
