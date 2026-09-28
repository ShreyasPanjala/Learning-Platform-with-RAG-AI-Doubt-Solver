from typing import List
import logging
from app.config import settings

logger = logging.getLogger("embedding_service")

# Lazy-loaded model singleton to optimize startup time and memory footprint
_model_instance = None


def get_embedding_model():
    """
    Load and cache the SentenceTransformer embedding model instance.
    """
    global _model_instance
    if _model_instance is None:
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
            _model_instance = SentenceTransformer(settings.EMBEDDING_MODEL)
        except Exception as e:
            logger.error(f"Failed to load embedding model '{settings.EMBEDDING_MODEL}': {e}")
            raise RuntimeError(f"Embedding model initialization failed: {e}")
    return _model_instance


def generate_embedding(text: str) -> List[float]:
    """
    Generate embedding vector for a single string.
    """
    if not text.strip():
        raise ValueError("Cannot generate embedding for empty text.")
    model = get_embedding_model()
    embedding = model.encode(text, convert_to_numpy=True).tolist()
    return embedding


def generate_embeddings_batch(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for a list of strings efficiently in batch.
    """
    if not texts:
        return []
    model = get_embedding_model()
    embeddings = model.encode(texts, convert_to_numpy=True).tolist()
    return embeddings
