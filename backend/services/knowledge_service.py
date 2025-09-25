from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

class KnowledgeService:
    def __init__(self, index_path="faiss_index"):
        self.index_path = index_path
        self.embeddings = None
        self.vector_store = None

    def load(self):
        """Loads the embedding model and the FAISS index into memory."""
        print("Knowledge Service: Loading embedding model...")
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        print(f"Knowledge Service: Loading FAISS index from {self.index_path}...")
        # Add the required argument to allow loading the trusted local file
        self.vector_store = FAISS.load_local(
            self.index_path, 
            self.embeddings, 
            allow_dangerous_deserialization=True # <-- THE FIX IS HERE
        )
        print("Knowledge Service: Loading complete.")

    def get_relevant_context(self, query: str, k: int = 3) -> str:
        """
        Searches the vector store for the most relevant documents for a given query.
        """
        if not self.vector_store:
            return ""
        
        docs = self.vector_store.similarity_search(query, k=k)
        context = "\n\n".join([doc.page_content for doc in docs])
        return context

# Create a single instance of the service to be used by the app
knowledge_service = KnowledgeService()