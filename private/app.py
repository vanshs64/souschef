from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from recipe import get_recipe, get_recipe_data
from interpret import extract_recipe_info  # Updated import
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
    desired_servings = data.get("desiredServings", 0)

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        # Scrape raw data from the URL
        scraped_data = get_recipe(url)

        # Extract the raw HTML from scraped data
        html = scraped_data.get("raw_html", "")
        if not html:
            # If get_recipe doesn't return raw HTML, re-fetch it
            html = urlopen(url).read().decode("utf-8")

        # Analyze the text with interpret.py
        refined_info = extract_recipe_info(html)  # Directly pass HTML

        if refined_info:
            # Merge refined_info into scraped_data
            scraped_data["title"] = refined_info.get("title", scraped_data.get("title", "Untitled Recipe"))
            scraped_data["ingredients"] = refined_info.get("ingredients", scraped_data.get("ingredients", []))
            scraped_data["instructions"] = refined_info.get("instructions", scraped_data.get("instructions", []))
            scraped_data["notes"] = refined_info.get("notes", scraped_data.get("notes", ""))
            scraped_data["total_time"] = refined_info.get("total_time", scraped_data.get("total_time", 0))
            scraped_data["yields"] = refined_info.get("yields", scraped_data.get("yields", "N/A"))

            # Optionally adjust ingredients based on desired servings
            if desired_servings and scraped_data.get("yields"):
                # Simple scaling logic (improvement needed for complex scaling)
                try:
                    # Extract current servings from yields (e.g., "4 servings")
                    import re
                    match = re.search(r'(\d+)', scraped_data["yields"])
                    if match:
                        current_servings = int(match.group(1))
                        scaling_factor = desired_servings / current_servings
                        scaled_ingredients = []
                        for ingredient in scraped_data["ingredients"]:
                            # Simple scaling: Prefix quantity with scaling factor
                            # For more accurate scaling, quantity parsing is needed
                            scaled_ingredient = f"{scaling_factor:.2f}x {ingredient}"
                            scaled_ingredients.append(scaled_ingredient)
                        scraped_data["ingredients"] = scaled_ingredients
                        scraped_data["yields"] = f"{desired_servings} servings"
                except Exception as scale_e:
                    print(f"Error scaling ingredients: {scale_e}")
                    # If scaling fails, proceed without scaling

        return jsonify(scraped_data)

    except Exception as e:
        print(f"Error processing recipe: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/ingredients", methods=["GET"])
def get_ingredients():
    """
    API endpoint to get default or fallback recipe data.
    """
    recipe_data = get_recipe_data()
    return jsonify(recipe_data)


if __name__ == "__main__":
    app.run(port=5000, debug=True)