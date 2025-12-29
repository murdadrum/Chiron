import React from 'react';

const VirtualViewport = () => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#181818',
            backgroundImage: `
                linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '30px 40px',
                backgroundColor: 'rgba(10,10,10,0.85)',
                borderRadius: '12px',
                border: '1px solid #333',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                zIndex: 10
            }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏗️</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem', letterSpacing: '0.5px' }}>3D Viewport Simulation</h3>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>Awaiting directive from Chiron...</p>
            </div>

            {/* Simulated Axis Lines */}
            <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: 'rgba(255, 68, 68, 0.2)', top: '50%' }}></div>
            <div style={{ position: 'absolute', height: '100%', width: '1px', backgroundColor: 'rgba(68, 255, 68, 0.2)', left: '50%' }}></div>
        </div>
    );
};

export default VirtualViewport;
