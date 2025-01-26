import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserInput.css';

const UserInput = () => {
    const [input, setInput] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) {
            setError('Please enter a recipe URL');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: input.trim(),
                    desiredServings: quantity,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/recipe', { state: { recipeData: data } });
            } else {
                setError(data.error || 'Failed to fetch recipe data');
            }
        } catch (error) {
            setError('An error occurred while fetching the recipe.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter recipe URL"
                    disabled={loading}
                    required
                />
                <div className="quantity-input">
                    <label htmlFor="quantity">Desired Servings:</label>
                    <input 
                        id="quantity"
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        disabled={loading}
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !input.trim()}
                >
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default UserInput;