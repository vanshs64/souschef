import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CongratulationsPage.css'; // Create corresponding CSS

const CongratulationsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="congratulations-page">
            <h1>Congratulations!</h1>
            <p>You've successfully completed the recipe!</p>
            <button onClick={() => navigate('/')}>
                Cook Another Recipe
            </button>
        </div>
    );
};

export default CongratulationsPage;