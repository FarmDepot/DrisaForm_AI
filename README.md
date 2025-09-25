# DrisaForm AI Chatbot
Author: Drisa Infotech
Last Updated: September 25, 2025
Location: FCT, Nigeria

# 1. Overview
DrisaForm is an intelligent, multilingual AI chatbot designed to function as an on-site Agriculture Support Expert for the FarmDepot.ng marketplace. Powered by Nigeria's cutting-edge N-ATLAS language model, DrisaForm is engineered to understand and communicate fluently in English, Hausa, Igbo, and Yoruba.
The primary goal of this project is to enhance user experience and accessibility by allowing farmers and buyers to interact with the website using natural language. DrisaForm can understand user intent, answer questions, and perform actions on the website, such as navigating to pages, searching for products, and assisting with form submissions for registration and product posting.
This project consists of two main components:
 * A FastAPI (Python) backend that handles the core logic and communication with the N-ATLAS AI model.
 * A JavaScript frontend widget packaged as an easy-to-install WordPress plugin for seamless integration with the FarmDepot.ng website.
2. Features
 * Multilingual Support: Natively understands and responds in English, Hausa, Igbo, and Yoruba.
 * Natural Language Understanding: Leverages the N-ATLAS model via the Hugging Face API to interpret user commands and questions.
 * Interactive Website Actions: Can trigger functions on the website, including:
   * Navigating to the registration or "sell a product" pages.
   * Performing product searches.
   * Assisting users by filling out form fields.
 * Simple Integration: Packaged as a standard WordPress plugin for quick and easy installation.
 * Customizable Theming: The chat widget's appearance can be easily modified via CSS.
3. Tech Stack
 * Backend:
   * Python 3.9+
   * FastAPI
   * Uvicorn (ASGI Server)
   * requests (for API communication)
   * python-dotenv (for environment variables)
 * Frontend:
   * Vanilla JavaScript (ES6+)
   * HTML5 & CSS3
 * AI Model:
   * N-ATLAS (via Hugging Face Inference API)
 * Deployment:
   * WordPress Plugin
4. Project Structure
/drisaform-chatbot/
├── backend/
│   ├── .env                  # Environment variables (API keys)
│   ├── main.py               # FastAPI main application
│   ├── requirements.txt      # Python dependencies
│   └── services/
│       ├── __init__.py
│       ├── nlp_service.py    # Handles communication with N-ATLAS
│       └── farmdepot_actions.py # Translates intents into actions
│
└── drisaform-chatbot-plugin/
    ├── drisaform-chatbot-plugin.php  # Main WordPress plugin file
    └── js/
        └── drisaform-plugin.js     # All-in-one JavaScript for the widget

5. Prerequisites
Before you begin, ensure you have the following installed:
 * Python 3.9 or later
 * pip (Python package installer)
 * A running WordPress website (for installing the plugin)
 * A Hugging Face account with an active API Key.
6. Installation & Setup
Follow these steps to get DrisaForm running.
Part A: Backend Setup
 * Clone the Repository (or create the files):
   git clone https://github.com/your-username/drisaform-chatbot.git
cd drisaform-chatbot/backend

 * Create and Activate a Virtual Environment:
   # For Windows
python -m venv venv
.\venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

 * Install Dependencies:
   pip install -r requirements.txt

 * Configure Environment Variables:
   Create a file named .env inside the backend/ directory. Add your Hugging Face API key and the model endpoint URL.
   HUGGING_FACE_API_KEY="hf_YOUR_API_KEY_HERE"
HUGGING_FACE_NATLAS_ENDPOINT="https://api-inference.huggingface.co/models/N-ATLAS-ORGANIZATION/N-ATLAS-Model-Name"

   (Note: The endpoint URL is a placeholder. You must replace it with the actual URL for the N-ATLAS model on Hugging Face.)
 * Run the Backend Server:
   uvicorn main:app --reload

   The server should now be running at http://127.0.0.1:8000.
Part B: Frontend WordPress Plugin Setup
 * Prepare the Plugin File:
   Navigate to the drisaform-chatbot-plugin/ directory provided in this project. Compress (zip) the entire folder. The resulting file should be drisaform-chatbot-plugin.zip.
 * Update the Backend URL (if necessary):
   Before zipping, you can open js/drisaform-plugin.js and modify the BACKEND_URL constant if your FastAPI server is running on a different address.
   const BACKEND_URL = "http://127.0.0.1:8000/chat";

 * Install and Activate in WordPress:
   * Log in to your WordPress admin dashboard.
   * Go to Plugins -> Add New.
   * Click on Upload Plugin.
   * Choose the drisaform-chatbot-plugin.zip file and click Install Now.
   * Once installed, click Activate.
The DrisaForm chat widget should now be active and visible on your FarmDepot.ng website.
7. Usage
Once installed, a chat bubble will appear in the bottom-right corner of your website. Click on it to open the chat window. You can interact with DrisaForm by typing messages in any of the supported languages.
Example Commands:
 * "I want to sign up"
 * (In Hausa) "Ina so in sayar da doya" (I want to sell yams)
 * "Show me tractors in Kaduna"
 * (In Igbo) "Kedu ka m ga-esi debanye aha?" (How can I register?)
8. N-ATLAS API Integration Note
The nlp_service.py file currently contains mock logic to simulate the behavior of the N-ATLAS model for development purposes. To connect to the real model, you must:
 * Uncomment the "REAL API CALL" section in the get_intent_from_natlas function.
 * Ensure your .env file contains the correct, active endpoint for the N-ATLAS model on Hugging Face.
 * Adjust the response parsing based on the actual JSON structure returned by the N-ATLAS API.
9. License
This project is licensed under the GPLv2 or later. See the drisaform-chatbot-plugin.php file for details.

