import React from 'react';
import './InstructionsTree.css';

const InstructionsTree = ({ instructions, currentStep, setCurrentStep }) => {
    if (!instructions || instructions.length === 0) {
        return <div>No instructions available.</div>;
    }
    return (
        <div className="instructions-tree-container">
            <ul className="instructions-tree">
                {instructions.map((step, index) => (
                    <InstructionNode 
                        key={index} 
                        step={step} 
                        stepNumber={index + 1} 
                        currentStep={currentStep} 
                        setCurrentStep={setCurrentStep}
                    />
                ))}
            </ul>
        </div>
    );
};

const InstructionNode = ({ step, stepNumber, currentStep, setCurrentStep }) => {
    if (Array.isArray(step)) {
        return (
            <li className="instruction-item branch">
                {step.map((subStep, subIndex) => (
                    <InstructionSubNode 
                        key={subIndex} 
                        subStep={subStep} 
                        parentStepNumber={stepNumber} 
                        subIndex={subIndex + 1}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                    />
                ))}
            </li>
        );
    } else {
        return (
            <li 
                className={`instruction-item ${currentStep === stepNumber ? 'active' : ''}`} 
                onClick={() => setCurrentStep(stepNumber)}
            >
                <span className="step-number">{stepNumber}.</span> {step}
            </li>
        );
    }
};

const InstructionSubNode = ({ subStep, parentStepNumber, subIndex, currentStep, setCurrentStep }) => {
    const stepId = `${parentStepNumber}.${subIndex}`;
    return (
        <div className="sub-instruction">
            <li 
                className={`instruction-item ${currentStep === stepId ? 'active' : ''}`} 
                onClick={() => setCurrentStep(stepId)}
            >
                <span className="step-number">{stepId}.</span> {subStep}
            </li>
        </div>
    );
};

export default InstructionsTree;