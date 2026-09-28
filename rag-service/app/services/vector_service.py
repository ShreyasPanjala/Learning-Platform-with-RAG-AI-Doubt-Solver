from typing import List, Dict, Any, Optional
import logging
import math
import json
import os
from pinecone import Pinecone, ServerlessSpec
from app.config import settings

logger = logging.getLogger("vector_service")

_pinecone_client = None
_pinecone_index = None

# In-memory vector store fallback for instant zero-config operations
_in_memory_vectors: List[Dict[str, Any]] = []

STORAGE_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "vectors_store.json")


def load_vectors_from_disk():
    """Load vector cache from disk into memory on startup."""
    global _in_memory_vectors
    if os.path.exists(STORAGE_FILE):
        try:
            with open(STORAGE_FILE, "r", encoding="utf-8") as f:
                _in_memory_vectors = json.load(f)
            logger.info(f"Loaded {len(_in_memory_vectors)} chunks from disk cache ({STORAGE_FILE})")
        except Exception as e:
            logger.warning(f"Failed to load vector cache from disk: {e}")
            _in_memory_vectors = []


def save_vectors_to_disk():
    """Persist vector cache to disk."""
    try:
        os.makedirs(os.path.dirname(STORAGE_FILE), exist_ok=True)
        with open(STORAGE_FILE, "w", encoding="utf-8") as f:
            json.dump(_in_memory_vectors, f)
        logger.info(f"Persisted {len(_in_memory_vectors)} chunks to disk cache ({STORAGE_FILE})")
    except Exception as e:
        logger.warning(f"Failed to save vector cache to disk: {e}")


# Initialize vector cache on module import
load_vectors_from_disk()


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Calculate cosine similarity between two float vectors."""
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_v1 = math.sqrt(sum(a * a for a in v1))
    norm_v2 = math.sqrt(sum(b * b for b in v2))
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)


def is_pinecone_configured() -> bool:
    """Check if Pinecone API key is configured with a valid string."""
    key = settings.PINECONE_API_KEY
    if not key or key == "your_pinecone_api_key_here" or "your_" in key.lower():
        return False
    return True


def get_pinecone_index():
    """
    Initialize Pinecone client and return index handle if valid configuration exists.
    """
    global _pinecone_client, _pinecone_index
    if _pinecone_index is not None:
        return _pinecone_index

    if not is_pinecone_configured():
        logger.info("Pinecone API key is not configured. Using local in-memory vector store.")
        return None

    try:
        _pinecone_client = Pinecone(api_key=settings.PINECONE_API_KEY)
        index_name = settings.PINECONE_INDEX_NAME

        # Ensure index exists or create it if missing
        existing_indexes = [idx.name for idx in _pinecone_client.list_indexes()]
        if index_name not in existing_indexes:
            logger.info(f"Creating Pinecone index '{index_name}' with dim={settings.EMBEDDING_DIMENSION}")
            _pinecone_client.create_index(
                name=index_name,
                dimension=settings.EMBEDDING_DIMENSION,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )

        _pinecone_index = _pinecone_client.Index(index_name)
        return _pinecone_index
    except Exception as e:
        logger.warning(f"Pinecone initialization failed: {e}. Falling back to in-memory vector store.")
        return None


def upsert_chunks_to_pinecone(
    chunks: List[Dict[str, Any]],
    embeddings: List[List[float]],
    namespace: Optional[str] = None
) -> int:
    """
    Upsert document chunk vectors and metadata into local store and Pinecone (if available).
    """
    global _in_memory_vectors

    # 1. Always store into local in-memory vector repository
    for chunk, embedding in zip(chunks, embeddings):
        # Remove existing chunk with same chunk_id if present
        _in_memory_vectors = [v for v in _in_memory_vectors if v["chunk_id"] != chunk["chunk_id"]]
        
        _in_memory_vectors.append({
            "chunk_id": chunk["chunk_id"],
            "values": embedding,
            "document_id": str(chunk["document_id"]),
            "user_id": str(chunk["user_id"]),
            "filename": str(chunk["filename"]),
            "page_number": int(chunk["page_number"]),
            "chunk_index": int(chunk["chunk_index"]),
            "text": str(chunk["text"])
        })

    save_vectors_to_disk()
    logger.info(f"Stored {len(chunks)} chunks in local vector repository (Total: {len(_in_memory_vectors)})")

    # 2. Attempt Pinecone Cloud upsert if configured
    index = get_pinecone_index()
    if index is not None:
        try:
            target_namespace = namespace or settings.PINECONE_NAMESPACE
            vectors_to_upsert = []

            for chunk, embedding in zip(chunks, embeddings):
                vectors_to_upsert.append({
                    "id": chunk["chunk_id"],
                    "values": embedding,
                    "metadata": {
                        "document_id": str(chunk["document_id"]),
                        "user_id": str(chunk["user_id"]),
                        "filename": str(chunk["filename"]),
                        "page_number": int(chunk["page_number"]),
                        "chunk_index": int(chunk["chunk_index"]),
                        "text": str(chunk["text"])
                    }
                })

            batch_size = 100
            for i in range(0, len(vectors_to_upsert), batch_size):
                batch = vectors_to_upsert[i:i + batch_size]
                index.upsert(vectors=batch, namespace=target_namespace)
            logger.info("Successfully upserted vectors to Pinecone index.")
        except Exception as e:
            logger.warning(f"Pinecone upsert failed: {e}. Local in-memory vectors will be used for query.")

    return len(chunks)


def query_relevant_chunks(
    query_vector: List[float],
    user_id: str,
    document_ids: Optional[List[str]] = None,
    top_k: int = 5,
    namespace: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Query relevant chunk vectors matching user_id metadata filter.
    Tries Pinecone first; falls back to in-memory cosine similarity search.
    """
    matches = []
    index = get_pinecone_index()

    if index is not None:
        try:
            target_namespace = namespace or settings.PINECONE_NAMESPACE
            metadata_filter: Dict[str, Any] = {"user_id": str(user_id)}

            if document_ids and len(document_ids) > 0:
                if len(document_ids) == 1:
                    metadata_filter["document_id"] = str(document_ids[0])
                else:
                    metadata_filter["document_id"] = {"$in": [str(d) for d in document_ids]}

            results = index.query(
                namespace=target_namespace,
                vector=query_vector,
                top_k=top_k,
                include_metadata=True,
                filter=metadata_filter
            )

            for match in results.get("matches", []):
                matches.append({
                    "score": match.get("score", 0.0),
                    "chunk_id": match.get("id"),
                    "document_id": match["metadata"].get("document_id"),
                    "filename": match["metadata"].get("filename"),
                    "page_number": match["metadata"].get("page_number"),
                    "chunk_index": match["metadata"].get("chunk_index"),
                    "text": match["metadata"].get("text", "")
                })

            if matches:
                return matches
        except Exception as e:
            logger.warning(f"Pinecone query failed: {e}. Falling back to in-memory search.")

    # In-memory cosine similarity search fallback
    scored_chunks = []
    doc_id_set = set(str(d) for d in document_ids) if document_ids else None

    for item in _in_memory_vectors:
        if item["user_id"] != str(user_id):
            continue
        if doc_id_set and item["document_id"] not in doc_id_set:
            continue

        score = cosine_similarity(query_vector, item["values"])
        scored_chunks.append({
            "score": score,
            "chunk_id": item["chunk_id"],
            "document_id": item["document_id"],
            "filename": item["filename"],
            "page_number": item["page_number"],
            "chunk_index": item["chunk_index"],
            "text": item["text"]
        })

    # Sort descending by score and pick top_k
    scored_chunks.sort(key=lambda x: x["score"], reverse=True)
    return scored_chunks[:top_k]


def delete_document_vectors(document_id: str, user_id: str, namespace: Optional[str] = None):
    """
    Delete all vectors for a specific document belonging to user from local store and Pinecone.
    """
    global _in_memory_vectors
    _in_memory_vectors = [
        v for v in _in_memory_vectors
        if not (v["document_id"] == str(document_id) and v["user_id"] == str(user_id))
    ]
    save_vectors_to_disk()

    index = get_pinecone_index()
    if index is not None:
        try:
            target_namespace = namespace or settings.PINECONE_NAMESPACE
            index.delete(
                namespace=target_namespace,
                filter={
                    "document_id": str(document_id),
                    "user_id": str(user_id)
                }
            )
        except Exception as e:
            logger.warning(f"Pinecone vector deletion failed: {e}")


