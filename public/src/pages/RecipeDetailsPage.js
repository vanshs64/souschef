import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InstructionsTree from '../components/InstructionsTree';
import '../styles/RecipeDetailsPage.css';

const RecipeDetailsPage = () => {
    const [recipeData, setRecipeData] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const recipeDataFromLocation = location.state?.recipeData;

    useEffect(() => {
        if (recipeDataFromLocation) {
            setRecipeData(recipeDataFromLocation);
            setCurrentStep(1); // Initialize to first step
        }
    }, [recipeDataFromLocation]);

    if (!recipeData) {
        return <div>No recipe data available</div>;
    }

    const handleFinish = () => {
        navigate('/congratulations', { state: { recipeData } });
    };

    return (
        <div className="recipe-details-container">
            <header className="instruction-counter">
                Step {currentStep} of {getTotalSteps(recipeData.instructions)}
            </header>
            <div className="recipe-details-content">
                <aside className="ingredients-section">
                    <h2>Ingredients</h2>
                    <ul>
                        {recipeData.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </aside>
                <main className="instructions-section">
                    <InstructionsTree 
                        instructions={recipeData.instructions} 
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                    />
                </main>
            </div>
            <footer className="navigation-buttons">
                {currentStep === getTotalSteps(recipeData.instructions) ? (
                    <button className="finish-button" onClick={handleFinish}>
                        Finish Recipe!
                    </button>
                ) : (
                    <button 
                        className="next-button" 
                        onClick={() => setCurrentStep(prev => prev + 1)}
                    >
                        Next Step
                    </button>
                )}
                <button className="secondary-button" onClick={() => navigate('/')}>
                    Try Another Recipe
                </button>
            </footer>
        </div>
    );
};

// Helper function to calculate total steps including branches
const getTotalSteps = (instructions) => {
    let count = 0;
    const traverse = (steps) => {
        steps.forEach(step => {
            count += 1;
            if (step.children && step.children.length > 0) {
                traverse(step.children);
            }
        });
    };
    traverse(instructions);
    return count;
};

export default RecipeDetailsPage;