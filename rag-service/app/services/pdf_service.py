from typing import List, Dict, Any
import fitz  # PyMuPDF
import re
import io


class PDFProcessingError(Exception):
    """Custom exception raised when document extraction fails."""
    pass


# Alias for general document processing error
DocumentProcessingError = PDFProcessingError


def clean_text(text: str) -> str:
    """
    Clean extracted text by removing extra whitespace while maintaining readability.
    """
    if not text:
        return ""
    # Replace multiple newlines with at most 2 newlines (preserve paragraphs)
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Replace multiple spaces with a single space
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()


def extract_pages_from_pdf_bytes(pdf_bytes: bytes, filename: str = "") -> List[Dict[str, Any]]:
    """
    Extract page-by-page text from PDF binary data using PyMuPDF (fitz).
    Returns list of dicts with keys: page_number, text.
    """
    pages = []
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if doc.page_count == 0:
            raise PDFProcessingError("PDF file contains 0 pages.")

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text")
            cleaned = clean_text(text)
            if cleaned:
                pages.append({
                    "page_number": page_num + 1,  # 1-indexed page numbering
                    "text": cleaned
                })
        doc.close()
        return pages
    except Exception as e:
        if isinstance(e, PDFProcessingError):
            raise e
        raise PDFProcessingError(f"Failed to process PDF '{filename}': {str(e)}")


def extract_pages_from_docx_bytes(docx_bytes: bytes, filename: str = "") -> List[Dict[str, Any]]:
    """
    Extract text paragraphs from DOCX binary data using python-docx.
    Group paragraphs into logical page sections (approx ~1000 chars per section).
    """
    try:
        import docx
        doc = docx.Document(io.BytesIO(docx_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        full_text = "\n\n".join(paragraphs)
        cleaned = clean_text(full_text)
        if not cleaned:
            raise PDFProcessingError("DOCX file contains no extractable text.")
        
        # Split into logical sections of ~1200 characters to simulate pages
        section_size = 1200
        sections = [cleaned[i:i + section_size] for i in range(0, len(cleaned), section_size)]
        
        return [
            {"page_number": idx + 1, "text": sec}
            for idx, sec in enumerate(sections)
        ]
    except Exception as e:
        if isinstance(e, PDFProcessingError):
            raise e
        raise PDFProcessingError(f"Failed to process DOCX '{filename}': {str(e)}")


def extract_pages_from_text_bytes(text_bytes: bytes, filename: str = "") -> List[Dict[str, Any]]:
    """
    Extract text from plain text or Markdown bytes (.txt, .md).
    """
    try:
        decoded = text_bytes.decode("utf-8", errors="ignore")
        cleaned = clean_text(decoded)
        if not cleaned:
            raise PDFProcessingError("Text file contains no extractable content.")

        section_size = 1200
        sections = [cleaned[i:i + section_size] for i in range(0, len(cleaned), section_size)]
        return [
            {"page_number": idx + 1, "text": sec}
            for idx, sec in enumerate(sections)
        ]
    except Exception as e:
        if isinstance(e, PDFProcessingError):
            raise e
        raise PDFProcessingError(f"Failed to process text file '{filename}': {str(e)}")


def extract_pages_from_file_bytes(file_bytes: bytes, filename: str = "") -> List[Dict[str, Any]]:
    """
    Dispatcher to extract pages/sections based on file extension.
    """
    ext = filename.lower().split('.')[-1] if '.' in filename else ""
    if ext == 'docx':
        return extract_pages_from_docx_bytes(file_bytes, filename)
    elif ext in ['txt', 'md']:
        return extract_pages_from_text_bytes(file_bytes, filename)
    else:
        # Default to PDF extraction
        return extract_pages_from_pdf_bytes(file_bytes, filename)
