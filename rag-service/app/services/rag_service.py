from typing import List, Dict, Any, Optional
import logging
from groq import Groq

from app.config import settings
from app.services.embedding_service import generate_embedding
from app.services.vector_service import query_relevant_chunks

logger = logging.getLogger("rag_service")

_groq_client = None


def get_groq_client():
    """
    Initialize and return Groq client instance if valid key exists.
    """
    global _groq_client
    if _groq_client is not None:
        return _groq_client

    key = settings.GROQ_API_KEY
    if not key or key == "your_groq_api_key_here" or "your_" in key.lower():
        logger.info("GROQ_API_KEY is not configured with a valid key.")
        return None

    try:
        _groq_client = Groq(api_key=key)
        return _groq_client
    except Exception as e:
        logger.warning(f"Failed to initialize Groq client: {e}")
        return None


def construct_rag_prompt(question: str, chunks: List[Dict[str, Any]]) -> str:
    """
    Construct a grounded prompt ensuring the model uses retrieved context to answer naturally.
    """
    if not chunks:
        context_str = "No document context available."
    else:
        context_blocks = []
        for i, chunk in enumerate(chunks, 1):
            source_tag = f"[Document: {chunk['filename']}, Page {chunk['page_number']}]"
            context_blocks.append(f"{source_tag}\n{chunk['text']}")
        context_str = "\n\n".join(context_blocks)

    prompt = f"""RETRIEVED DOCUMENT MATERIAL:
{context_str}

STUDENT'S QUESTION / REQUEST:
{question}

INSTRUCTIONS FOR YOUR RESPONSE:
1. Direct & Relevant: Provide a structured, easy-to-read answer focused strictly on answering what the student asked. Avoid raw text dumps, verbatim quote pastes, or irrelevant tangents.
2. Understanding Intent:
   - If the student asks general overview questions (e.g. "what is in the document?", "summarize this material", "what topics are covered?"), synthesize a clear, bulleted summary of the core concepts, topics, or question items found in the document.
   - If the student asks a specific conceptual or analytical question, answer directly with clear explanations.
3. Clean Formatting: Use bullet points, bold section titles, and clean spacing.
4. Source Citation: At the very end of your response, add exactly ONE concise line citing the source document and page numbers used, in this format:
   *Source: <Filename> (Page <X>)* or *Source: <Filename> (Pages <X, Y>)*
5. Grounding: Rely strictly on the material above. If the material does not contain enough context to answer, state politely: "The provided document material does not contain enough details to answer this question."
"""
    return prompt


def generate_rag_answer(
    question: str,
    user_id: str,
    document_ids: Optional[List[str]] = None,
    history: Optional[List[Dict[str, Any]]] = None,
    top_k: int = 5
) -> Dict[str, Any]:
    """
    Complete RAG Pipeline: Question -> Embedding -> Vector Search -> Conversational LLM Synthesis -> Answer + Sources.
    """
    if not question.strip():
        raise ValueError("Question cannot be empty.")

    # 1. Generate Question Embedding
    query_vector = generate_embedding(question)

    # 2. Vector Similarity Search
    relevant_chunks = query_relevant_chunks(
        query_vector=query_vector,
        user_id=user_id,
        document_ids=document_ids,
        top_k=top_k
    )

    # 3. Construct Sources List & Citation String
    sources = []
    seen_sources = set()
    source_citation_str = ""
    
    if relevant_chunks:
        pages_by_doc = {}
        for chunk in relevant_chunks:
            doc_id = chunk["document_id"]
            fname = chunk["filename"]
            page = chunk["page_number"]
            key = (doc_id, fname, page)
            if key not in seen_sources:
                seen_sources.add(key)
                sources.append({
                    "documentId": doc_id,
                    "filename": fname,
                    "page": page,
                    "score": round(chunk["score"], 4)
                })
            
            if fname not in pages_by_doc:
                pages_by_doc[fname] = set()
            pages_by_doc[fname].add(page)
        
        citation_parts = []
        for fname, pages in pages_by_doc.items():
            sorted_pages = sorted(list(pages))
            if len(sorted_pages) == 1:
                p_str = f"Page {sorted_pages[0]}"
            else:
                p_str = f"Pages {', '.join(str(p) for p in sorted_pages)}"
            citation_parts.append(f"{fname} ({p_str})")
        
        source_citation_str = f"*Source: {'; '.join(citation_parts)}*"

    # 4. Construct Prompt
    user_prompt = construct_rag_prompt(question, relevant_chunks)

    # 5. Invoke Groq LLM with Model Fallback candidate list
    answer_text = None
    client = get_groq_client()

    candidate_models = [
        settings.LLM_MODEL,
        "qwen/qwen3.8-27b",
        "openai/gpt-oss-120b",
        "groq/compound",
        "qwen/qwen3.6-27b"
    ]
    # Remove duplicates while preserving order
    unique_candidate_models = []
    for m in candidate_models:
        if m and m not in unique_candidate_models:
            unique_candidate_models.append(m)

    system_role_desc = (
        "You are LearnAI, an expert, conversational NLP educational assistant. "
        "You analyze course documents and answer student questions clearly, concisely, and with excellent structure. "
        "Always tailor your answer directly to what the student asks."
    )

    if client is not None:
        messages = [{"role": "system", "content": system_role_desc}]

        # Append past conversation history if present for multi-turn NLP context
        if history and isinstance(history, list):
            for h in history[-6:]:
                sender = h.get("sender") or h.get("role")
                content = h.get("content")
                if content and sender in ["user", "assistant"]:
                    messages.append({
                        "role": "user" if sender == "user" else "assistant",
                        "content": content
                    })

        messages.append({"role": "user", "content": user_prompt})

        for model_name in unique_candidate_models:
            try:
                logger.info(f"Attempting RAG synthesis with model: {model_name}")
                response = client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    temperature=0.2,
                    max_tokens=1024
                )
                raw_answer = response.choices[0].message.content
                if raw_answer and raw_answer.strip():
                    answer_text = raw_answer.strip()
                    break
            except Exception as e:
                logger.warning(f"Groq API call error with model {model_name}: {e}")
                continue

    # 6. Fallback Answer Generation (if LLM is unavailable or failed)
    if answer_text is None:
        if not relevant_chunks:
            answer_text = "The uploaded material does not contain relevant information to answer this question."
        else:
            # Clean, structured fallback summary
            fname = relevant_chunks[0]['filename']
            answer_text = f"**Summary of relevant content from {fname}:**\n\n"
            summary_points = []
            for c in relevant_chunks[:4]:
                clean_text = c['text'].strip().replace("\n", " ")
                if len(clean_text) > 180:
                    clean_text = clean_text[:180] + "..."
                summary_points.append(f"• {clean_text}")
            answer_text += "\n\n".join(summary_points)

    # 7. Ensure single clean source citation line at the bottom
    if source_citation_str and "*Source:" not in answer_text:
        answer_text = f"{answer_text.strip()}\n\n{source_citation_str}"

    return {
        "question": question,
        "answer": answer_text,
        "sources": sources,
        "chunksRetrieved": len(relevant_chunks)
    }


def generate_rag_answer_stream(
    question: str,
    user_id: str,
    document_ids: Optional[List[str]] = None,
    history: Optional[List[Dict[str, Any]]] = None,
    top_k: int = 5
):
    """
    Generator yielding Server-Sent Events (SSE) stream for RAG answer generation.
    First yields sources metadata as JSON, then streams token chunks.
    """
    import json
    if not question.strip():
        yield f"data: {json.dumps({'error': 'Question cannot be empty.'})}\n\n"
        return

    # 1. Embed and query vectors
    query_vector = generate_embedding(question)
    relevant_chunks = query_relevant_chunks(
        query_vector=query_vector,
        user_id=user_id,
        document_ids=document_ids,
        top_k=top_k
    )

    # 2. Build Sources
    sources = []
    seen_sources = set()
    pages_by_doc = {}
    if relevant_chunks:
        for chunk in relevant_chunks:
            doc_id = chunk["document_id"]
            fname = chunk["filename"]
            page = chunk["page_number"]
            key = (doc_id, fname, page)
            if key not in seen_sources:
                seen_sources.add(key)
                sources.append({
                    "documentId": doc_id,
                    "filename": fname,
                    "page": page,
                    "score": round(chunk["score"], 4)
                })
            if fname not in pages_by_doc:
                pages_by_doc[fname] = set()
            pages_by_doc[fname].add(page)

    # First event: meta (sources)
    yield f"data: {json.dumps({'type': 'meta', 'sources': sources, 'chunksRetrieved': len(relevant_chunks)})}\n\n"

    # 3. Build Prompt & LLM Client
    user_prompt = construct_rag_prompt(question, relevant_chunks)
    client = get_groq_client()

    candidate_models = [
        settings.LLM_MODEL,
        "qwen/qwen3.8-27b",
        "openai/gpt-oss-120b",
        "groq/compound",
        "qwen/qwen3.6-27b"
    ]
    unique_candidate_models = []
    for m in candidate_models:
        if m and m not in unique_candidate_models:
            unique_candidate_models.append(m)

    system_role_desc = (
        "You are LearnAI, an expert, conversational NLP educational assistant. "
        "You analyze course documents and answer student questions clearly, concisely, and with excellent structure. "
        "Always tailor your answer directly to what the student asks."
    )

    streamed_successfully = False

    if client is not None:
        messages = [{"role": "system", "content": system_role_desc}]
        if history and isinstance(history, list):
            for h in history[-6:]:
                sender = h.get("sender") or h.get("role")
                content = h.get("content")
                if content and sender in ["user", "assistant"]:
                    messages.append({
                        "role": "user" if sender == "user" else "assistant",
                        "content": content
                    })
        messages.append({"role": "user", "content": user_prompt})

        for model_name in unique_candidate_models:
            try:
                logger.info(f"Attempting RAG streaming with model: {model_name}")
                stream = client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    temperature=0.2,
                    max_tokens=1024,
                    stream=True
                )
                for chunk in stream:
                    delta = chunk.choices[0].delta.content or ""
                    if delta:
                        yield f"data: {json.dumps({'type': 'token', 'token': delta})}\n\n"
                streamed_successfully = True
                break
            except Exception as e:
                logger.warning(f"Groq API streaming error with model {model_name}: {e}")
                continue

    if not streamed_successfully:
        # Fallback non-streamed response sent as a token batch
        fallback_res = generate_rag_answer(question, user_id, document_ids, history, top_k)
        yield f"data: {json.dumps({'type': 'token', 'token': fallback_res['answer']})}\n\n"

    yield "data: [DONE]\n\n"
