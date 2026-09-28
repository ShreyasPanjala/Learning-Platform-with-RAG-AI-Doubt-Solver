# RAG AI Doubt Solver - Python FastAPI Service

Dedicated microservice responsible for document processing, embedding generation, Pinecone vector database integration, retrieval-augmented generation (RAG), and Groq LLM response generation.

## Features

- **Health Check Endpoint**: `GET /health` returns `{"status": "ok"}`.
- **Document Processing**: PyMuPDF extraction, cleaning, and configurable text chunking.
- **Embeddings**: High-performance embedding generation.
- **Vector Search**: Pinecone metadata-filtered vector indexing and retrieval.
- **Grounded QA**: Groq API integration producing accurate citations and grounded answers.

## Architecture

This service operates as an internal backend service. The React frontend communicates exclusively through the Node.js / Express gateway, which proxies authenticated requests to this service.

```
React Frontend -> Express Gateway (Node.js) -> FastAPI RAG Service -> Pinecone / Groq
```

## Setup & Running

1. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. **Start the Service**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. **Verify Health Endpoint**:
   ```bash
   curl http://localhost:8000/health
   # Expected response: {"status": "ok"}
   ```
