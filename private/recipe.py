from urllib.request import urlopen
from urllib.error import HTTPError
from recipe_scrapers import scrape_html

def get_recipe(url):
    recipe_dict = {
        "title": "",
        "total_time": 0,
        "yields": "",
        "ingredients": [],
        "instructions": [],  # Changed to an empty list
        "raw_html": ""        # Added to store raw HTML
    }
    try:
        html = urlopen(url).read().decode("utf-8")
        scraper = scrape_html(html, org_url=url)

        recipe_dict["title"] = scraper.title()
        recipe_dict["total_time"] = scraper.total_time()
        recipe_dict["yields"] = scraper.yields()
        recipe_dict["ingredients"] = scraper.ingredients()
        # Ensure instructions are a list
        instructions = scraper.instructions()
        if isinstance(instructions, str):
            # Split instructions into a list based on newlines
            recipe_dict["instructions"] = [step.strip() for step in instructions.split('\n') if step.strip()]
        elif isinstance(instructions, list):
            recipe_dict["instructions"] = instructions
        else:
            # Handle any other unexpected types
            recipe_dict["instructions"] = []

        recipe_dict["raw_html"] = html  # Store raw HTML for AI processing
        return recipe_dict
    except HTTPError as e:
        if e.code == 403:
            raise Exception("Access forbidden to the URL")
        else:
            raise Exception(f"HTTP Error: {e}")

def get_recipe_data():
    """
    Default fallback data with instructions as a list.
    """
    return {
        "title": "Default Recipe",
        "total_time": 30,
        "yields": "2 servings",
        "ingredients": ["2 cups flour", "1 cup sugar", "2 eggs"],
        "instructions": [
            "Mix all ingredients together.",
            "Bake at 350F for 20 minutes."
        ]
    }