import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import CongratulationsPage from './components/CongratulationsPage';
import './styles/App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recipe" element={<RecipeDetailsPage />} />
                    <Route path="/congratulations" element={<CongratulationsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;