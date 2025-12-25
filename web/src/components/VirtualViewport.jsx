import React from 'react';

const VirtualViewport = () => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(45deg, #2a2a2a 25%, #333 25%, #333 50%, #2a2a2a 50%, #2a2a2a 75%, #333 75%, #333 100%)',
            backgroundSize: '40px 40px'
        }}>
            <div style={{
                padding: '20px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: '8px',
                border: '1px solid #555'
            }}>
                <h3>Virtual Viewport</h3>
                <p style={{ color: '#aaa' }}>Waiting for simulation...</p>
            </div>
        </div>
    );
};

export default VirtualViewport;
