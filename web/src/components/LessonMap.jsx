import React, { useState } from 'react';
import chapters from '../assets/chapters.json';
import { useLesson } from '../context/LessonContext';

const TreeNode = ({ node }) => {
    const [expanded, setExpanded] = useState(false);
    const { selectChapter, selectedChapter } = useLesson();
    const hasChildren = node.children && node.children.length > 0;

    const handleClick = () => {
        if (hasChildren) {
            setExpanded(!expanded);
        } else {
            selectChapter(node.title);
        }
    };

    const isSelected = selectedChapter === node.title;

    return (
        <div className="tree-node" style={{ marginLeft: '20px' }}>
            <div
                className="node-title"
                onClick={handleClick}
                style={{
                    cursor: 'pointer',
                    padding: '4px 8px',
                    backgroundColor: isSelected ? '#3d3d3d' : 'transparent',
                    borderRadius: '4px',
                    color: isSelected ? '#00ff88' : '#e0e0e0',
                    transition: 'all 0.2s'
                }}
            >
                {hasChildren && <span style={{ marginRight: '8px' }}>{expanded ? '▼' : '▶'}</span>}
                {node.title}
            </div>
            {expanded && hasChildren && (
                <div className="node-children">
                    {node.children.map((child, index) => (
                        <TreeNode key={index} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

const LessonMap = () => {
    return (
        <div className="lesson-map" style={{
            textAlign: 'left',
            padding: '20px',
            backgroundColor: '#111',
            color: '#e0e0e0',
            height: '100%',
            overflowY: 'auto',
            boxSizing: 'border-box'
        }}>
            <h2 style={{
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#666',
                marginBottom: '20px',
                borderBottom: '1px solid #222',
                paddingBottom: '10px'
            }}>Lesson Map</h2>
            <div className="chapter-list">
                {chapters.map((chapter, index) => (
                    <TreeNode key={index} node={chapter} />
                ))}
            </div>
        </div>
    );
};

export default LessonMap;
