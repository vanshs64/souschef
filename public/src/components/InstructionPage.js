import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/App.css';

const InstructionPage = ({ onQuit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const timelineRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const recipeData = location.state?.recipeData;

    const scrollToStep = (stepIndex) => {
        const stepNode = timelineRef.current?.children[stepIndex];
        if (stepNode) {
            stepNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleKeyNavigation = (e) => {
        if (e.key === 'ArrowRight' && currentStep < recipeData.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else if (e.key === 'ArrowLeft' && currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyNavigation);
        return () => window.removeEventListener('keydown', handleKeyNavigation);
    }, [currentStep]);

    useEffect(() => {
        scrollToStep(currentStep);
    }, [currentStep]);

    if (!recipeData) {
        return <div>No recipe data found</div>;
    }

    return (
        <div className="instruction-page">
            <div className="step-counter">
                Step {currentStep + 1} of {recipeData.steps.length}
            </div>

            <div className="timeline-container" ref={timelineRef}>
                <div className="timeline">
                    {recipeData.steps.map((step, index) => (
                        <div 
                            key={index} 
                            className={`step-node ${index === currentStep ? 'active' : ''}`}
                            onClick={() => setCurrentStep(index)}
                        >
                            <div className="step-content">
                                <span className="step-number">{index + 1}</span>
                                <p className="step-text">{step.instruction}</p>
                                {step.duration && (
                                    <span className="duration">{step.duration} min</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="button-container">
                {currentStep === recipeData.steps.length - 1 ? (
                    <button 
                        className="finish-button"
                        onClick={() => navigate('/congratulations', { state: { recipeData } })}
                    >
                        Finish Recipe!
                    </button>
                ) : (
                    <button className="next-button" onClick={() => setCurrentStep(prev => prev + 1)}>
                        Next Step
                    </button>
                )}
                <button className="secondary-button" onClick={onQuit}>
                    Try Another Recipe
                </button>
            </div>
        </div>
    );
};

export default InstructionPage;