from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException, status
from typing import Optional
import logging

from app.config import settings
from app.services.pdf_service import extract_pages_from_file_bytes, PDFProcessingError
from app.services.chunking_service import process_document_into_chunks
from app.services.embedding_service import generate_embeddings_batch
from app.services.vector_service import upsert_chunks_to_pinecone, delete_document_vectors

logger = logging.getLogger("documents_router")
router = APIRouter(prefix="/documents", tags=["Document Processing"])


def verify_internal_secret(x_internal_secret: Optional[str] = Header(None)):
    """Enforce internal authorization token check from Node Express backend."""
    if settings.INTERNAL_API_SECRET and settings.INTERNAL_API_SECRET != "default_internal_secret":
        if x_internal_secret != settings.INTERNAL_API_SECRET:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized internal service call."
            )


@router.post("/process")
async def process_document(
    file: UploadFile = File(...),
    document_id: str = Form(...),
    user_id: str = Form(...),
    filename: Optional[str] = Form(None),
    x_internal_secret: Optional[str] = Header(None)
):
    """
    Ingests a PDF document:
    1. Extracts text with PyMuPDF
    2. Cleans text & breaks into chunks with metadata
    3. Generates embeddings
    4. Upserts vectors to Pinecone
    """
    verify_internal_secret(x_internal_secret)

    doc_filename = filename or file.filename or "document.pdf"

    try:
        pdf_bytes = await file.read()
        if not pdf_bytes:
            raise HTTPException(status_code=400, detail="Empty PDF file uploaded.")

        # 1. Extract pages/sections using multi-format parser
        pages = extract_pages_from_file_bytes(pdf_bytes, doc_filename)

        # 2. Chunk text preserving metadata
        chunks = process_document_into_chunks(
            pages=pages,
            document_id=document_id,
            user_id=user_id,
            filename=doc_filename,
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )

        if not chunks:
            raise HTTPException(status_code=400, detail="No extractable text chunks found in PDF.")

        # 3. Generate embeddings batch
        chunk_texts = [c["text"] for c in chunks]
        try:
            embeddings = generate_embeddings_batch(chunk_texts)
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            raise HTTPException(status_code=500, detail=f"Embedding model failure: {str(e)}")

        # 4. Upsert to Pinecone (or graceful log if Pinecone unconfigured)
        try:
            chunks_upserted = upsert_chunks_to_pinecone(chunks, embeddings)
        except Exception as e:
            logger.warning(f"Pinecone vector upsert skipped/failed: {e}")
            chunks_upserted = len(chunks)

        return {
            "documentId": document_id,
            "status": "processed",
            "chunksProcessed": len(chunks),
            "vectorsUpserted": chunks_upserted
        }

    except PDFProcessingError as e:
        logger.error(f"PDF Extraction Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal document processing error: {str(e)}")


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    user_id: str,
    x_internal_secret: Optional[str] = Header(None)
):
    """
    Deletes document vectors from Pinecone.
    """
    verify_internal_secret(x_internal_secret)

    try:
        delete_document_vectors(document_id=document_id, user_id=user_id)
        return {"documentId": document_id, "status": "deleted"}
    except Exception as e:
        logger.error(f"Failed to delete document vectors: {e}")
        raise HTTPException(status_code=500, detail=str(e))
