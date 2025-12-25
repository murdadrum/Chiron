import React from 'react';
import './DesktopLayout.css';

const DesktopLayout = ({ leftPanel, centerPanel, bottomPanel }) => {
    return (
        <div className="desktop-layout">
            <aside className="layout-left">
                {leftPanel}
            </aside>
            <main className="layout-center">
                {centerPanel}
            </main>
            <footer className="layout-bottom">
                {bottomPanel}
            </footer>
        </div>
    );
};

export default DesktopLayout;
