import requests
import time # <-- Import the time library for delays
from bs4 import BeautifulSoup

# --- UPDATED IMPORTS for new LangChain version ---
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings # <-- Import from the new package
from langchain_community.vectorstores import FAISS

# --- 1. Scrape Text Content from FarmDepot.ng (with improvements) ---
def scrape_website(urls):
    """Scrapes text from a list of URLs."""
    # --- ADDED: A User-Agent header to mimic a real browser ---
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    all_text = ""
    for url in urls:
        try:
            response = requests.get(url, headers=headers) # <-- Use the headers
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'lxml')
            
            if soup.nav:
                soup.nav.decompose()
            if soup.footer:
                soup.footer.decompose()

            main_content = soup.find('main') or soup.find('body')
            if main_content:
                text = main_content.get_text(separator='\n', strip=True)
                all_text += text + "\n\n"
            print(f"Successfully scraped: {url}")
        except requests.RequestException as e:
            print(f"Error scraping {url}: {e}")
        
        # --- ADDED: A delay to be polite to the server ---
        print("Waiting for 2 seconds before next request...")
        time.sleep(2) # Wait for 2 seconds

    return all_text

# --- 2. Process and Store the Knowledge (with updated import) ---
def build_and_save_vector_store(text_content, index_path="faiss_index"):
    """Chunks text, creates embeddings, and saves them to a FAISS vector store."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs = text_splitter.split_text(text_content)
    print(f"Split content into {len(docs)} chunks.")

    print("Loading embedding model...")
    # This now uses the updated HuggingFaceEmbeddings class
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    print("Creating FAISS vector store...")
    vector_store = FAISS.from_texts(docs, embeddings)
    vector_store.save_local(index_path)
    print(f"Knowledge base built and saved to '{index_path}'")


if __name__ == "__main__":
    # You can curate this list to the most important pages
    farmdepot_urls = [
        "https://farmdepot.ng/",
        "https://farmdepot.ng/about-us/",
        "https://farmdepot.ng/contact-us/",
        "https://farmdepot.ng/faq/",
        "https://farmdepot.ng/selling-tips/",
        "https://farmdepot.ng/blog/",
        "https://farmdepot.ng/contact-us/",
        "https://farmdepot.ng/listing-category",
        "https://farmdepot.ng/privacy-policy/",
        "https://farmdepot.ng/terms-and-conditions/",
        "https://farmdepot.ng/listing-location",
        "https://farmdepot.ng/membership-checkout/?pmpro_level=1"
        "https://farmdepot.ng/membership-checkout/?pmpro_level=2",
        "https://farmdepot.ng/membership-checkout/?pmpro_level=3",
        "https://farmdepot.ng/membership-checkout/?pmpro_level=4",
        "https://farmdepot.ng/how-to-stay-safe-online-tips-for-sellers-and-buyers-on-farm-depot-marketplace/",
        "https://farmdepot.ng/selling-tips/",
        "https://farmdepot.ng/membership-levels/",
        "https://farmdepot.ng/sitemap_index.xml",
        "https://farmdepot.ng/listings",
        # Add any other key informational pages
    ]
    
    print("Starting to build the knowledge base for DrisaForm...")
    scraped_content = scrape_website(farmdepot_urls)
    
    if scraped_content:
        build_and_save_vector_store(scraped_content)
    else:
        print("No content was scraped. Aborting knowledge base creation.")