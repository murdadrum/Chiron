import React from 'react';

const InstructorConsole = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00ff88', marginRight: '10px' }}></div>
                <span style={{ fontWeight: 'bold', color: '#00ff88' }}>AI INSTRUCTOR</span>
            </div>
            <p>System Online. Standing by for lesson selection...</p>
        </div>
    );
};

export default InstructorConsole;
