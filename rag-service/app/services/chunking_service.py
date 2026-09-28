from typing import List, Dict, Any


def chunk_page_text(
    page_text: str,
    page_number: int,
    document_id: str,
    user_id: str,
    filename: str,
    chunk_size: int = 500,
    chunk_overlap: int = 50,
    start_chunk_index: int = 0
) -> List[Dict[str, Any]]:
    """
    Splits text from a single page into overlapping chunks and attaches metadata.
    """
    if not page_text:
        return []

    chunks = []
    text_length = len(page_text)
    start = 0
    current_chunk_idx = start_chunk_index

    while start < text_length:
        end = min(start + chunk_size, text_length)
        
        # Try to break at a sentence boundary or word boundary if possible
        if end < text_length:
            break_point = page_text.rfind('. ', start, end)
            if break_point != -1 and break_point > start + (chunk_size // 2):
                end = break_point + 1
            else:
                space_point = page_text.rfind(' ', start, end)
                if space_point != -1 and space_point > start + (chunk_size // 2):
                    end = space_point

        chunk_str = page_text[start:end].strip()
        if chunk_str:
            chunk_metadata = {
                "chunk_id": f"{document_id}_p{page_number}_c{current_chunk_idx}",
                "document_id": document_id,
                "user_id": user_id,
                "filename": filename,
                "page_number": page_number,
                "chunk_index": current_chunk_idx,
                "text": chunk_str
            }
            chunks.append(chunk_metadata)
            current_chunk_idx += 1

        if end >= text_length:
            break

        start = end - chunk_overlap if end - chunk_overlap > start else end

    return chunks


def process_document_into_chunks(
    pages: List[Dict[str, Any]],
    document_id: str,
    user_id: str,
    filename: str,
    chunk_size: int = 500,
    chunk_overlap: int = 50
) -> List[Dict[str, Any]]:
    """
    Processes all pages of a document into chunk dictionaries with metadata.
    """
    all_chunks = []
    global_chunk_idx = 0

    for page in pages:
        page_chunks = chunk_page_text(
            page_text=page["text"],
            page_number=page["page_number"],
            document_id=document_id,
            user_id=user_id,
            filename=filename,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            start_chunk_index=global_chunk_idx
        )
        all_chunks.extend(page_chunks)
        global_chunk_idx += len(page_chunks)

    return all_chunks
