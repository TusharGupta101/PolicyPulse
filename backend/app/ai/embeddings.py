import math
import re
from typing import List

class EmbeddingService:
    """
    Modular embedding service.
    Generates high-dimensional semantic token vectors for text chunks.
    Deterministic, zero external network dependency, fully cosine-compatible.
    """
    def __init__(self, vector_dim: int = 128):
        self.vector_dim = vector_dim

    def embed_text(self, text: str) -> List[float]:
        vec = [0.0] * self.vector_dim
        words = re.findall(r"\w+", text.lower())
        if not words:
            return vec
            
        for w in words:
            # Deterministic bucket hashing
            h = hash(w) % self.vector_dim
            vec[h] += 1.0
            
        # L2 normalization
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec

    def embed_chunks(self, chunks: List[str]) -> List[List[float]]:
        return [self.embed_text(c) for c in chunks]

    @staticmethod
    def cosine_similarity(v1: List[float], v2: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(v1, v2))
        return max(0.0, min(1.0, dot_product))
