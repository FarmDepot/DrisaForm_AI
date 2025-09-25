from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import str

from services import nlp_service, farmdepot_actions

app = FastAPI()

# Allow requests from your website's domain
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "https://your-farmdepot-domain.ng", # Add your actual domain
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
    language: str # e.g., 'en', 'ha', 'ig', 'yo'

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
