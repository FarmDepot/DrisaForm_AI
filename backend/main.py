from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# The "from typing import str" line has been removed.

from services import nlp_service, farmdepot_actions

app = FastAPI()

# Allow requests from your website's domain
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "https://farmdepot.ng", # Add your actual domain
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
    language: str # This uses the built-in str, which is correct.

@app.get("/")
def read_root():
    return {"DrisaForm": "AI Agent is Online"}

@app.post("/chat")
def chat_with_drisa(request: ChatRequest):
    """
    Main endpoint to handle chat requests.
    """
    # 1. Get intent from N-ATLAS
    intent_data = nlp_service.get_intent_from_natlas(request.message, request.language)
    
    # 2. Determine action based on intent
    response_data = farmdepot_actions.execute_action(intent_data)
    
    return response_data