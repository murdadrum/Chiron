import React from 'react';
import { useLesson } from '../context/LessonContext';

const InstructorConsole = () => {
    const { selectedChapter, lessonData, loading, error, currentStepIndex, nextStep, prevStep, requestCustomLesson } = useLesson();
    const [inputValue, setInputValue] = React.useState('');

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
            padding: '20px',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#e0e0e0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: loading ? '#ffcc00' : '#00ff88',
                    marginRight: '10px',
                    boxShadow: loading ? '0 0 10px #ffcc00' : '0 0 10px #00ff88',
                    animation: loading ? 'pulse 1s infinite' : 'none'
                }}></div>
                <span style={{ fontWeight: 'bold', color: loading ? '#ffcc00' : '#00ff88', letterSpacing: '1px' }}>
                    {loading ? 'AI ANALYZING...' : 'AI INSTRUCTOR'}
                </span>
            </div>

            {loading && (
                <div style={{ fontStyle: 'italic', color: '#888' }}>
                    Consulting Blender 5.0 Manual for "{selectedChapter}"...
                </div>
            )}

            {error && (
                <div style={{ color: '#ff4444', backgroundColor: '#331111', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #ff4444' }}>
                    Error: {error}
                </div>
            )}

            {currentStep && (
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#fff' }}>{selectedChapter}</h3>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '20px', color: '#00ff88' }}>
                        {currentStep.text}
                    </p>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.8rem', backgroundColor: '#333', padding: '4px 8px', borderRadius: '4px' }}>
                            <span style={{ color: '#888' }}>Target: </span>
                            <span style={{ color: '#aaa' }}>{currentStep.ui_target}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', backgroundColor: '#333', padding: '4px 8px', borderRadius: '4px' }}>
                            <span style={{ color: '#888' }}>Cmd: </span>
                            <span style={{ fontWeight: 'bold' }}>{currentStep.command}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={prevStep}
                            disabled={currentStepIndex === 0}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#333',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '4px',
                                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                                opacity: currentStepIndex === 0 ? 0.5 : 1
                            }}
                        >
                            Previous
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={currentStepIndex === lessonData.length - 1}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#00ff88',
                                border: 'none',
                                color: '#000',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                cursor: currentStepIndex === lessonData.length - 1 ? 'not-allowed' : 'pointer',
                                opacity: currentStepIndex === lessonData.length - 1 ? 0.5 : 1
                            }}
                        >
                            {currentStepIndex === lessonData.length - 1 ? 'Lesson Finished' : 'Next Step'}
                        </button>
                    </div>
                </div>
            )}

            {!loading && !currentStep && !error && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <p style={{ color: '#888', marginBottom: '20px' }}>System Online. Select a chapter from the Lesson Map OR ask me anything below.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{
                marginTop: 'auto',
                display: 'flex',
                gap: '10px',
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #333'
            }}>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>&gt;</span>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Chiron... (e.g. 'How do I extrude?')"
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#fff',
                        outline: 'none',
                        fontFamily: 'monospace',
                        fontSize: '1rem'
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
                        fontSize: '0.8rem',
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
