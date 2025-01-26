import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/RecipeStyles.css';

const IngredientsPage = ({ onQuit }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const recipeData = location.state?.recipeData || { ingredients: [] };

    if (!recipeData || !Array.isArray(recipeData.ingredients)) {
        return (
            <div className="error-page">
                <h2>No ingredients data found</h2>
                <button onClick={() => navigate('/')}>Return to Home</button>
            </div>
        );
    }

    return (
        <div className="ingredients-page">
            <h1>{recipeData.title || 'Recipe'}</h1>
            
            <div className="ingredients-grid">
                {recipeData.ingredients.map((ing, index) => (
                    <div key={index} className="ingredient-card">
                        {/* Assuming each ingredient is a string; adjust if it's an object */}
                        <span className="ingredient-name">{ing}</span>
                    </div>
                ))}
            </div>

            <div className="button-container">
                <button className="primary-button" onClick={() => 
                    navigate('/instruction/0', { state: { recipeData } })
                }>
                    Ready to Cook!
                </button>
                <button className="secondary-button" onClick={onQuit}>
                    Try Another Recipe
                </button>
            </div>

            {recipeData.cookingTips && recipeData.cookingTips.length > 0 && (
                <div className="cooking-tips">
                    <h3>Pro Tips</h3>
                    {recipeData.cookingTips.map((tip, index) => (
                        <div key={index} className="tip-card">
                            <span className="tip-number">Tip {index + 1}</span>
                            <p>{tip}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IngredientsPage;