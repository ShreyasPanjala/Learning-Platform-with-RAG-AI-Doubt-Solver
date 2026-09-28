import pytest
from app.services.pdf_service import clean_text, extract_pages_from_pdf_bytes, PDFProcessingError
from app.services.chunking_service import chunk_page_text, process_document_into_chunks


def test_clean_text():
    raw_text = "  Hello   World!  \n\n\n\nThis is   a   test.  "
    cleaned = clean_text(raw_text)
    assert "Hello World!" in cleaned
    assert "\n\n" in cleaned
    assert "\n\n\n" not in cleaned


def test_chunk_page_text():
    sample_text = "Paragraph 1 sentence one. Paragraph 1 sentence two. " * 10
    chunks = chunk_page_text(
        page_text=sample_text,
        page_number=1,
        document_id="doc123",
        user_id="user456",
        filename="test.pdf",
        chunk_size=100,
        chunk_overlap=20
    )
    assert len(chunks) > 0
    first_chunk = chunks[0]
    assert first_chunk["document_id"] == "doc123"
    assert first_chunk["user_id"] == "user456"
    assert first_chunk["filename"] == "test.pdf"
    assert first_chunk["page_number"] == 1
    assert "text" in first_chunk


def test_process_document_into_chunks():
    pages = [
        {"page_number": 1, "text": "Page one text. " * 5},
        {"page_number": 2, "text": "Page two text. " * 5}
    ]
    chunks = process_document_into_chunks(
        pages=pages,
        document_id="doc999",
        user_id="user999",
        filename="sample.pdf",
        chunk_size=100,
        chunk_overlap=20
    )
    assert len(chunks) >= 2
    page_numbers = {c["page_number"] for c in chunks}
    assert 1 in page_numbers
    assert 2 in page_numbers
