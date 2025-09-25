import os
import requests
import json
from dotenv import load_dotenv
# Import the knowledge service instance
from .knowledge_service import knowledge_service

load_dotenv()

API_KEY = os.getenv("HUGGE_FACE_API_KEY")
NATLAS_API_URL = os.getenv("HUGGE_FACE_NATLAS_ENDPOINT")

headers = {"Authorization": f"Bearer {API_KEY}"}

def _create_intent_prompt(user_message: str) -> str:
    """Creates a prompt to classify the user's initial intent."""
    return f"""
    Analyze the user's query for an agricultural marketplace. Classify the intent as one of: 'navigate_to_register', 'navigate_to_sell', 'search_product', 'general_inquiry'.
    Return ONLY the intent in JSON format. Examples:
    - Query: "I need to sign up" -> {{"intent": "navigate_to_register"}}
    - Query: "how do i sell my chickens" -> {{"intent": "navigate_to_sell"}}
    - Query: "are there tractors for sale" -> {{"intent": "search_product"}}
    - Query: "what are your payment options" -> {{"intent": "general_inquiry"}}
    
    User Query: "{user_message}" ->
    """

def _create_rag_prompt(user_message: str, context: str) -> str:
    """Creates a prompt for the AI to answer a question using provided context."""
    return f"""
    You are DrisaForm, a helpful AI assistant for the FarmDepot.ng marketplace.
    Answer the user's question based *only* on the following context.
    If the context doesn't contain the answer, say "I'm sorry, I don't have that information, but I can help you with other questions about FarmDepot.ng."
    Be friendly and concise.

    Context:
    ---
    {context}
    ---

    User Question: {user_message}
    """

def _call_natlas_model(prompt: str) -> str:
    """A reusable function to call the Hugging Face API."""
    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 150, "return_full_text": False}
    }
    response = requests.post(NATLAS_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    model_output = response.json()
    if model_output and isinstance(model_output, list) and "generated_text" in model_output[0]:
        return model_output[0]["generated_text"].strip()
    return ""

def get_intent_from_natlas(user_message: str, language: str):
    """
    Analyzes the user message, retrieves context for general inquiries,
    and generates a final response.
    """
    if not NATLAS_API_URL or not API_KEY:
        return {"message": "Error: AI service is not configured."}

    try:
        # --- Stage 1: Classify Intent ---
        intent_prompt = _create_intent_prompt(user_message)
        intent_response_text = _call_natlas_model(intent_prompt)
        intent_data = json.loads(intent_response_text)
        intent = intent_data.get("intent")
        print(f"Identified Intent: {intent}")

        # --- Stage 2: Act based on Intent ---
        if intent in ["navigate_to_register", "navigate_to_sell", "search_product"]:
             # For simple actions, we pass them to the action executor
             return {"intent": intent, "entities": {}}
        
        elif intent == "general_inquiry":
            # This is where RAG happens!
            print("General inquiry detected. Searching knowledge base...")
            context = knowledge_service.get_relevant_context(user_message)
            
            if not context:
                return {"message": "I can help with questions about buying and selling on FarmDepot.ng. How can I assist you?"}

            print("Found relevant context. Generating final answer...")
            rag_prompt = _create_rag_prompt(user_message, context)
            final_answer = _call_natlas_model(rag_prompt)
            return {"message": final_answer}
        
        else: # Fallback for unknown intents
            return {"message": "I'm not sure how to help with that, but I can assist with buying or selling products."}

    except requests.exceptions.RequestException as e:
        print(f"Error calling Hugging Face API: {e}")
        return {"message": "Sorry, I'm having trouble connecting to my brain right now."}
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Error parsing AI response: {e}")
        return {"message": "I received an unusual response, please try rephrasing your question."}