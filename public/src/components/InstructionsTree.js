import React from 'react';
import './InstructionsTree.css'; // Ensure to create appropriate styles

const InstructionsTree = ({ instructions, currentStep, setCurrentStep }) => {
    console.log("Instructions received:", instructions);
    if (!instructions || instructions.length === 0) {
        return <div>No instructions available.</div>;
    }
    return (
        <div className="instructions-tree-container">
            <div className="instructions-tree">
                {instructions.map((step) => (
                    <InstructionNode 
                        key={step.id} 
                        step={step} 
                        currentStep={currentStep} 
                        setCurrentStep={setCurrentStep} 
                    />
                ))}
            </div>
        </div>
    );
};

const InstructionNode = ({ step, currentStep, setCurrentStep }) => {
    console.log(`Rendering step: ${step.id} - ${step.instruction}`);
    return (
        <div className="instruction-node">
            <div 
                className={`instruction-content ${currentStep === step.id ? 'active' : ''}`}
                onClick={() => setCurrentStep(step.id)}
            >
                <span className="step-number">{step.id}.</span>
                <span className="step-text">{step.instruction}</span>
            </div>
            {step.children && step.children.length > 0 && (
                <div className="children-instructions">
                    {step.children.map(child => (
                        <InstructionNode 
                            key={child.id} 
                            step={child} 
                            currentStep={currentStep} 
                            setCurrentStep={setCurrentStep} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructionsTree;