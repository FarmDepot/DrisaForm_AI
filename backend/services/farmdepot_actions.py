def execute_action(intent_data: dict):
    """
    Determines the correct response or frontend action based on the intent.
    """
    intent = intent_data.get("intent")
    entities = intent_data.get("entities", {})

    print(f"Executing action for intent: {intent}")

    if intent == "navigate_to_register":
        return {
            "message": "Of course! I will open the registration page for you.",
            "action": "navigate",
            "payload": {"url": "/register"}
        }

    if intent == "navigate_to_sell":
        return {
            "message": "Let's get your product listed. Opening the selling page now.",
            "action": "navigate",
            "payload": {"url": "/sell-your-product"}
        }

    if intent == "search_product":
        product = entities.get('product', 'products')
        return {
            "message": f"Searching for '{product}' on FarmDepot.ng for you.",
            "action": "search",
            "payload": {"query": product}
        }
    
    if intent == "fill_form_field":
        selector = entities.get('field_selector')
        value = entities.get('value')
        if selector and value:
            return {
                "message": f"Okay, I've filled in the value for you.",
                "action": "fill_form",
                "payload": {"selector": selector, "value": value}
            }

    if intent == "api_error":
        return {"message": "I'm having trouble connecting to my brain right now. Please try again later."}
        
    # Default fallback response
    return {
        "message": "I'm here to help you with FarmDepot.ng. You can ask me to search for products, register, or sell items."
    }

