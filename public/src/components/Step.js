const Step = ({ instruction, duration, onComplete }) => {
    return (
        <div className="step">
            <h3>Step</h3>
            <p>{instruction}</p>
            {duration && <p>Duration: {duration}</p>}
            <button onClick={onComplete}>I'm done with this step</button>
        </div>
    );
};

export default Step;