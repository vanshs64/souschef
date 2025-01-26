# filepath: /c:/work/GitHub/geesetemp/private/interpret.py
import os
import openai
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")


def extract_recipe_info(website_html):
    """
    Extracts and organizes recipe information from the provided HTML using OpenAI's GPT-4.

    Args:
        website_html (str): The HTML content of the recipe page.

    Returns:
        dict: A dictionary containing extracted and organized recipe information.
    """
    try:
        basic_info = extract_basic_info(website_html)
        if not basic_info:
            return {}

        organized_instructions = organize_instructions(basic_info.get("instructions", []))

        recipe_info = {
            "title": basic_info.get("title", ""),
            "ingredients": basic_info.get("ingredients", []),
            "instructions": organized_instructions,
            "notes": basic_info.get("notes", ""),
            "total_time": basic_info.get("total_time", 0),
            "yields": basic_info.get("yields", "")
        }

        return recipe_info

    except Exception as e:
        print(f"Error extracting recipe info: {e}")
        return {}


def extract_basic_info(website_html):
    """
    Uses OpenAI's GPT-4 to extract basic recipe information from HTML.

    Args:
        website_html (str): The HTML content of the recipe page.

    Returns:
        dict: A dictionary containing basic extracted recipe information.
    """
    try:
        prompt = (
            "Extract the recipe title, total time, yields, ingredients, and instructions from the following HTML content. "
            "Return the information in JSON format with the keys: title, total_time, yields, ingredients (list), instructions (list). "
            "Ensure the instructions are split into individual steps."
        )

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts recipe information."},
                {"role": "user", "content": prompt + "\n\n" + website_html}
            ],
            temperature=0.3,
        )

        recipe_json = response.choices[0].message['content'].strip()
        recipe_data = json.loads(recipe_json)
        return recipe_data

    except json.JSONDecodeError as jde:
        print(f"JSON decode error: {jde}")
        return {}
    except Exception as e:
        print(f"Error extracting basic info: {e}")
        return {}


def organize_instructions(instructions):
    """
    Uses OpenAI's GPT-4 to identify parallelizable steps and organizes instructions into a tree structure.

    Args:
        instructions (list): A list of instruction strings.

    Returns:
        list: A list of organized instructions with possible branching.
    """
    try:
        # Combine instructions into a single string
        instructions_text = "\n".join([f"{idx+1}. {step}" for idx, step in enumerate(instructions)])

        prompt = (
            "Analyze the following list of cooking instructions and identify any steps that can be parallelized or executed simultaneously. "
            "Organize the instructions into a hierarchical JSON structure where each step has an 'id', 'instruction', and an optional 'children' list for sub-steps.\n\n"
            f"Instructions:\n{instructions_text}\n\n"
            "Return the structured JSON."
        )

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant that organizes cooking instructions into a hierarchical structure."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )

        instructions_json = response.choices[0].message['content'].strip()
        instructions_data = json.loads(instructions_json)
        return instructions_data

    except json.JSONDecodeError as jde:
        print(f"JSON decode error in organizing instructions: {jde}")
        return []
    except Exception as e:
        print(f"Error organizing instructions: {e}")
        return []


# The main function is now optional and primarily for testing purposes
def main():
    """
    Example usage of extract_recipe_info.
    Reads 'website.txt', extracts and organizes recipe information, and writes to 'recipe_details.json'.
    """
    try:
        with open('website.txt', 'r', encoding='utf-8') as file:
            website_html = file.read()
    except FileNotFoundError:
        print("The file 'website.txt' was not found.")
        return

    recipe_details = extract_recipe_info(website_html)
    if recipe_details:
        with open('recipe_details.json', 'w', encoding='utf-8') as outfile:
            json.dump(recipe_details, outfile, indent=4)
        print("Recipe details extracted and saved to 'recipe_details.json'.")
    else:
        print("Failed to extract recipe details.")


if __name__ == "__main__":
    main()