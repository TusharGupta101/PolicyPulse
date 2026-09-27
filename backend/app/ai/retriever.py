from typing import List, Dict, Any
from app.ai.embeddings import EmbeddingService

class PolicyRetriever:
    """
    Vector memory store and retrieval engine for government policy chunks.
    """
    def __init__(self, embedding_service: EmbeddingService):
        self.embedding_service = embedding_service
        self.chunks: List[Dict[str, Any]] = []

    def add_chunk(self, scheme_code: str, title: str, section: str, text: str):
        embedding = self.embedding_service.embed_text(text + " " + title + " " + section)
        self.chunks.append({
            "scheme_code": scheme_code,
            "title": title,
            "section": section,
            "text": text,
            "embedding": embedding
        })

    def clear(self):
        self.chunks.clear()

    def retrieve(self, query: str, scheme_code: str = None, top_k: int = 3) -> List[Dict[str, Any]]:
        query_vec = self.embedding_service.embed_text(query)
        scored = []
        for item in self.chunks:
            if scheme_code and item["scheme_code"].upper() != scheme_code.upper():
                continue
            sim = self.embedding_service.cosine_similarity(query_vec, item["embedding"])
            scored.append({
                "scheme_code": item["scheme_code"],
                "title": item["title"],
                "section": item["section"],
                "text": item["text"],
                "score": round(sim, 4)
            })
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]
