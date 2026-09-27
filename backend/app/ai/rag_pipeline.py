import os
import json
from typing import List, Dict, Any
from app.ai.embeddings import EmbeddingService
from app.ai.retriever import PolicyRetriever

class RAGPipeline:
    def __init__(self):
        self.embeddings = EmbeddingService()
        self.retriever = PolicyRetriever(self.embeddings)
        self._initialized = False

    def initialize_knowledge_base(self, kb_path: str = None):
        if self._initialized:
            return
            
        if not kb_path:
            # Default location
            current_dir = os.path.dirname(os.path.abspath(__file__))
            root_dir = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
            kb_path = os.path.join(root_dir, "ai_data", "scheme_knowledge_base.json")
            
        if os.path.exists(kb_path):
            with open(kb_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data.get("schemes", []):
                    scheme_code = item.get("code")
                    for section in item.get("clauses", []):
                        self.retriever.add_chunk(
                            scheme_code=scheme_code,
                            title=item.get("name"),
                            section=section.get("section"),
                            text=section.get("text")
                        )
            self._initialized = True

    def query_policy(self, query: str, scheme_code: str = None, top_k: int = 3) -> List[Dict[str, Any]]:
        self.initialize_knowledge_base()
        return self.retriever.retrieve(query=query, scheme_code=scheme_code, top_k=top_k)

rag_pipeline = RAGPipeline()
