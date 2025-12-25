import React from 'react';
import { useLesson } from '../context/LessonContext';

const InstructorConsole = () => {
    const { selectedChapter, lessonData, loading, error, currentStepIndex, nextStep, prevStep, requestCustomLesson, resetLesson } = useLesson();
    const [inputValue, setInputValue] = React.useState('');
    const [isFinished, setIsFinished] = React.useState(false);

    React.useEffect(() => {
        if (loading) {
            setIsFinished(false);
        }
    }, [loading]);

    const handleFinished = () => {
        setIsFinished(true);
        resetLesson();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            requestCustomLesson(inputValue);
            setInputValue('');
        }
    };

    const currentStep = lessonData ? lessonData[currentStepIndex] : null;

    return (
        <div style={{
            padding: '15px 20px',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#e0e0e0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
        }}>
            {/* Pinned Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: loading ? '#ffcc00' : '#00ff88',
                    marginRight: '10px',
                    boxShadow: loading ? '0 0 10px #ffcc00' : '0 0 10px #00ff88',
                    animation: loading ? 'pulse 1s infinite' : 'none'
                }}></div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: loading ? '#ffcc00' : '#00ff88', letterSpacing: '1px' }}>
                    {loading ? 'AI ANALYZING...' : 'AI INSTRUCTOR'}
                </span>
            </div>

            {/* Scrollable Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', minHeight: 0 }}>
                {loading && (
                    <div style={{ fontStyle: 'italic', color: '#888', padding: '10px 0' }}>
                        Consulting Blender 5.0 Manual for "{selectedChapter}"...
                    </div>
                )}

                {error && (
                    <div style={{ color: '#ff4444', backgroundColor: '#331111', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #ff4444', margin: '10px 0' }}>
                        Error: {error}
                    </div>
                )}

                {currentStep && (
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#fff' }}>{selectedChapter}</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '15px', color: '#00ff88' }}>
                            {currentStep.text}
                        </p>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                            <div style={{ fontSize: '0.75rem', backgroundColor: '#333', padding: '3px 6px', borderRadius: '4px' }}>
                                <span style={{ color: '#888' }}>Target: </span>
                                <span style={{ color: '#aaa' }}>{currentStep.ui_target}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', backgroundColor: '#333', padding: '3px 6px', borderRadius: '4px' }}>
                                <span style={{ color: '#888' }}>Cmd: </span>
                                <span style={{ fontWeight: 'bold', color: '#fff' }}>{currentStep.command}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                            <button
                                onClick={prevStep}
                                disabled={currentStepIndex === 0}
                                style={{
                                    padding: '6px 14px',
                                    backgroundColor: '#333',
                                    border: 'none',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                                    opacity: currentStepIndex === 0 ? 0.5 : 1,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Previous
                            </button>
                            <button
                                onClick={currentStepIndex === lessonData.length - 1 ? handleFinished : nextStep}
                                style={{
                                    padding: '6px 14px',
                                    backgroundColor: '#00ff88',
                                    border: 'none',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    fontSize: '0.9rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'scale(1.05)';
                                    e.target.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                {currentStepIndex === lessonData.length - 1 ? 'Lesson Finished' : 'Next Step'}
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !currentStep && !error && (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '10px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{isFinished ? '✨' : '🎯'}</div>
                        <h2 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.2rem' }}>{isFinished ? "Lesson Finished!" : "System Online"}</h2>
                        <p style={{ color: '#888', maxWidth: '400px', fontSize: '0.9rem', margin: 0 }}>
                            {isFinished
                                ? "Great job! You've mastered this chapter. What's next?"
                                : "Select a chapter from the Lesson Map OR ask me anything below."}
                        </p>
                    </div>
                )}
            </div>

            {/* Pinned Input Form */}
            <form onSubmit={handleSubmit} style={{
                flexShrink: 0,
                display: 'flex',
                gap: '10px',
                backgroundColor: '#1a1a1a',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #333'
            }}>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>&gt;</span>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Chiron..."
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#fff',
                        outline: 'none',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading || !inputValue.trim()}
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #00ff88',
                        color: '#00ff88',
                        padding: '2px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        opacity: (loading || !inputValue.trim()) ? 0.5 : 1
                    }}
                >
                    ASK
                </button>
            </form>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default InstructorConsole;
