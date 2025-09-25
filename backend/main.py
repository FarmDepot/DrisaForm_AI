import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

# Import your services
from services import nlp_service, farmdepot_actions
from services.knowledge_service import knowledge_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application startup...")
    knowledge_service.load()
    yield
    print("Application shutdown...")

app = FastAPI(lifespan=lifespan)

# --- THE FIX IS HERE ---
# We are defining the list of allowed websites (origins)
# and adding the CORS middleware to the FastAPI app.
origins = [
    "https://farmdepot.ng",
    "https://www.farmdepot.ng", # To cover the 'www' subdomain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (POST, GET, etc.)
    allow_headers=["*"], # Allows all headers
)


class ChatRequest(BaseModel):
    message: str
    language: str

@app.get("/")
def read_root():
    return {"DrisaForm": "AI Agent is Online"}

@app.post("/chat")
def chat_with_drisa(request: ChatRequest):
    response_data = nlp_service.get_intent_from_natlas(request.message, request.language)

    if "action" in response_data:
        return farmdepot_actions.execute_action(response_data)

    return response_data

# This block is for running with 'python main.py'
if __name__ == "__main__":
    # Render provides the port to use in the PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)