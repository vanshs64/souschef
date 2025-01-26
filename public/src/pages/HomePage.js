import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChefLogo from '../components/ChefLogo';
import '../styles/HomePage.css'; // Create this file for HomePage-specific styles

const HomePage = () => {
  const [recipeInput, setRecipeInput] = useState('');
  const [servings, setServings] = useState(1);
  const [recipe, setRecipe] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    if (!recipeInput.trim()) {
      setError('Please enter a recipe URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: recipeInput.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecipe(data);
        setTimeline(data.instructions);
      } else {
        setError(data.error || 'Failed to fetch recipe data');
      }
    } catch (error) {
      setError('An error occurred while fetching the recipe.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServingsChange = (e) => {
    setServings(parseInt(e.target.value));
  };

  return (
    <div className="HomePage">
      <motion.header 
        className="App-header content-width-constraint"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <ChefLogo />
          <h1>SousChef</h1>
        </div>
      </motion.header>

      <motion.main
        className="content-width-constraint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div 
          className="recipe-input-container"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="recipe-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            What are we cooking today?
          </motion.h2>
          <form onSubmit={handleRecipeSubmit} className="recipe-input-form">
            <div className="input-group">
              <textarea
                id="recipe-input"
                value={recipeInput}
                onChange={(e) => setRecipeInput(e.target.value)}
                placeholder="Paste a recipe URL or instructions here..."
                rows="1"
              />
            </div>
            <div className="input-group">
              <label htmlFor="servings-input">Number of Servings:</label>
              <input
                type="number"
                id="servings-input"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value))}
                min="1"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? 'Processing...' : 'Process'}
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
        </motion.div>

        <div className="recipe-content-grid">
          {recipe && (
            <motion.section 
              className="servings-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Adjust Servings</h2>
              <div className="input-group">
                <label htmlFor="servings-input">Number of Servings:</label>
                <input
                  type="number"
                  id="servings-input"
                  value={servings}
                  onChange={handleServingsChange}
                  min="1"
                />
              </div>
            </motion.section>
          )}

          {timeline.length > 0 && (
            <motion.section 
              className="timeline-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Cooking Timeline</h2>
              <div className="timeline">
                {timeline.map((step, index) => (
                  <motion.div
                    key={index}
                    className="timeline-step"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="time">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default HomePage;