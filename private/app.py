from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from recipe import get_recipe
from interpret import get_organized_instruction  # Updated import
from urllib.request import urlopen

import os

load_dotenv()

app = Flask(__name__)

# Allow CORS for the frontend origin
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Update if frontend is hosted elsewhere


@app.route("/api/recipe", methods=["POST"])
def get_recipe_api():
    """
    API endpoint to scrape a recipe and extract detailed information using OpenAI.
    Expects JSON payload with 'url' and optionally 'desiredServings'.
    """
    data = request.get_json()
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        # Scrape raw data from the URL
        scraped_data = get_recipe(url)

        return jsonify(scraped_data) 

    except Exception as e:
        print(f"Error processing recipe: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/ingredients", methods=["POST"])
def get_ingredients():
    """
    API endpoint to get default or fallback recipe data.
    """
    data = request.get_json()
    url = data.get("url", "").strip()
    recipe_data = get_recipe(url)
    return jsonify(recipe_data)


if __name__ == "__main__":
    app.run(port=5000, debug=True)