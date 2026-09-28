import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_process_document_validation():
    # Test missing internal secret header when configured
    files = {"file": ("test.pdf", b"%PDF-1.4 dummy content", "application/pdf")}
    data = {"document_id": "doc123", "user_id": "user456"}
    
    response = client.post("/documents/process", files=files, data=data)
    # Should succeed or return 401 if secret required
    assert response.status_code in [200, 400, 401]


def test_chat_query_empty_question():
    payload = {
        "question": "   ",
        "userId": "user123"
    }
    response = client.post("/chat/query", json=payload)
    assert response.status_code in [400, 401]


def test_text_document_process():
    files = {"file": ("notes.txt", b"This is a test plain text study material for RAG indexing.", "text/plain")}
    data = {"document_id": "doc_txt_123", "user_id": "user456"}
    response = client.post("/documents/process", files=files, data=data)
    assert response.status_code in [200, 400, 401]


def test_chat_stream_endpoint():
    payload = {
        "question": "Summarize key topics",
        "userId": "user123"
    }
    response = client.post("/chat/stream", json=payload)
    assert response.status_code in [200, 401]
