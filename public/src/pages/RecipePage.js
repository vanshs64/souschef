import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeInstructions from '../components/RecipeInstructions';
import UserInput from '../components/UserInput';
import { useLocation } from 'react-router-dom';
import '../styles/App.css';

const RecipePage = () => {
    const [recipeData, setRecipeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { recipeData: locationRecipeData } = location.state || {};

    const fetchRecipeData = async (input) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/extract-recipe`, { input });
            setRecipeData(response.data);
        } catch (err) {
            setError('Failed to fetch recipe data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!locationRecipeData) {
        return <div>No recipe data available</div>;
    }

    return (
        <div className="recipe-page">
            <h1>{locationRecipeData.title}</h1>
            <UserInput onSubmit={fetchRecipeData} />
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {recipeData && <RecipeInstructions recipe={recipeData} />}
            <div className="ingredients-section">
                <h2>Ingredients</h2>
                <ul>
                    {locationRecipeData.ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient.quantity} {ingredient.unit} {ingredient.item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="steps-section">
                <h2>Steps</h2>
                <ol>
                    {locationRecipeData.steps.map((step, index) => (
                        <li key={index}>
                            {step.instruction}
                            {step.duration && <span> ({step.duration} minutes)</span>}
                        </li>
                    ))}
                </ol>
            </div>
            {locationRecipeData.totalTime && (
                <div className="total-time">
                    <p>Total Time: {locationRecipeData.totalTime} minutes</p>
                </div>
            )}
            {locationRecipeData.cookingTips && (
                <div className="cooking-tips">
                    <h2>Cooking Tips</h2>
                    <ul>
                        {locationRecipeData.cookingTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RecipePage;