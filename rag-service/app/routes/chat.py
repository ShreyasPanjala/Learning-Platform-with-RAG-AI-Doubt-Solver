from fastapi import APIRouter, Header, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging

from app.config import settings
from app.services.rag_service import generate_rag_answer, generate_rag_answer_stream

logger = logging.getLogger("chat_router")
router = APIRouter(prefix="/chat", tags=["RAG Chat"])


class QueryRequest(BaseModel):
    question: str
    userId: str
    documentIds: Optional[List[str]] = None
    history: Optional[List[Dict[str, Any]]] = None
    topK: Optional[int] = 5


def verify_internal_secret(x_internal_secret: Optional[str] = Header(None)):
    if settings.INTERNAL_API_SECRET and settings.INTERNAL_API_SECRET != "default_internal_secret":
        if x_internal_secret != settings.INTERNAL_API_SECRET:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized internal service call."
            )


@router.post("/query")
async def query_rag(
    body: QueryRequest,
    x_internal_secret: Optional[str] = Header(None)
):
    """
    RAG Query Endpoint:
    1. Embeds question
    2. Retrieves top context chunks from Pinecone
    3. Prompts Groq LLM with context & chat history
    4. Returns grounded answer + sources
    """
    verify_internal_secret(x_internal_secret)

    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        result = generate_rag_answer(
            question=body.question,
            user_id=body.userId,
            document_ids=body.documentIds,
            history=body.history,
            top_k=body.topK or 5
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"RAG query processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"RAG query failure: {str(e)}")


@router.post("/stream")
async def stream_rag(
    body: QueryRequest,
    x_internal_secret: Optional[str] = Header(None)
):
    """
    RAG Real-Time Token Streaming Endpoint (SSE).
    """
    verify_internal_secret(x_internal_secret)

    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    return StreamingResponse(
        generate_rag_answer_stream(
            question=body.question,
            user_id=body.userId,
            document_ids=body.documentIds,
            history=body.history,
            top_k=body.topK or 5
        ),
        media_type="text/event-stream"
    )
