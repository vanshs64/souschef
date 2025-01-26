import React from 'react';
import UserInput from '../components/UserInput';
import '../styles/App.css';

const HomePage = () => {
    return (
        <div className="layout">
            <header className="header">
                <div className="header-content">
                    <h1>SousChef Assistant</h1>
                </div>
            </header>
            <main className="main-content">
                <div className="container">
                    <div className="form-container">
                        <h2>Welcome to Your Cooking Assistant</h2>
                        <p>Provide a recipe link or paste your recipe text below:</p>
                        <UserInput />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;