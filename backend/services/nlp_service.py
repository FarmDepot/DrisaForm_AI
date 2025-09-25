import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_KEY = os.getenv("HUGGING_FACE_API_KEY")
NATLAS_API_URL = os.getenv("HUGGING_FACE_NATLAS_ENDPOINT")

headers = {"Authorization": f"Bearer {API_KEY}"}

def get_intent_from_natlas(user_message: str, language: str):
    """
    Analyzes the user message using the N-ATLAS model to extract intent and entities.
    
    NOTE: This is a MOCK function. The actual API call and response structure
    from the N-ATLAS model will need to be implemented once the model is available.
    We are simulating its expected behavior.
    """
    print(f"Sending to N-ATLAS (mock): '{user_message}' in {language}")

    # --- MOCK LOGIC: Replace with actual API call ---
    # This logic simulates what N-ATLAS should do.
    # It checks for keywords to determine the user's intent.
    
    lower_message = user_message.lower()

    if "register" in lower_message or "sign up" in lower_message:
        return {"intent": "navigate_to_register", "entities": {}}
    
    if "sell" in lower_message or "post product" in lower_message:
        return {"intent": "navigate_to_sell", "entities": {}}

    if "search" in lower_message or "buy" in lower_message or "find" in lower_message:
        # Simple entity extraction for demonstration
        product = "tractor" if "tractor" in lower_message else "yam" if "yam" in lower_message else "any"
        return {"intent": "search_product", "entities": {"product": product}}
    
    if "my name is" in lower_message:
        name = lower_message.split("my name is")[-1].strip()
        return {"intent": "fill_form_field", "entities": {"field_selector": "#fullName", "value": name}}

    # Default fallback intent
    return {"intent": "general_inquiry", "entities": {}}

    # --- REAL API CALL (Example of what it might look like) ---
    # try:
    #     response = requests.post(
    #         NATLAS_API_URL,
    #         headers=headers,
    #         json={"inputs": user_message, "parameters": {"language": language}}
    #     )
    #     response.raise_for_status() # Raise an exception for bad status codes
    #     return response.json()
    # except requests.exceptions.RequestException as e:
    #     print(f"Error calling Hugging Face API: {e}")
    #     return {"intent": "api_error", "entities": {}}

