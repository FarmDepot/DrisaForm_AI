from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

# Import your services
from services import nlp_service, farmdepot_actions
from services.knowledge_service import knowledge_service # Import the new service instance

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This code runs on startup
    print("Application startup...")
    knowledge_service.load() # Load the knowledge base into memory
    yield
    # This code runs on shutdown (optional)
    print("Application shutdown...")

app = FastAPI(lifespan=lifespan)

# ... (keep your CORS middleware and origins as they are) ...
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "https://farmdepot.ng",
    "https://drisaform-ai.onrender.com",
    # Add your GitHub Codespaces URL here for testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    language: str

@app.get("/")
def read_root():
    return {"DrisaForm": "AI Agent is Online"}

@app.post("/chat")
def chat_with_drisa(request: ChatRequest):
    """
    Main endpoint to handle chat requests.
    """
    # 1. Get intent from N-ATLAS (this function is now smarter)
    response_data = nlp_service.get_intent_from_natlas(request.message, request.language)
    
    # 2. If it's a direct action, execute it. Otherwise, the response
    # will already contain the AI-generated answer.
    if "action" in response_data:
        return farmdepot_actions.execute_action(response_data)
        
    return response_data