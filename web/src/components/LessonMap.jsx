import React, { useState } from 'react';
import chapters from '../assets/chapters.json';

const TreeNode = ({ node }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="tree-node" style={{ marginLeft: '20px' }}>
            <div
                className="node-title"
                onClick={() => setExpanded(!expanded)}
                style={{ cursor: hasChildren ? 'pointer' : 'default', padding: '4px 0' }}
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
        <div className="lesson-map" style={{ textAlign: 'left', padding: '20px', backgroundColor: '#1e1e1e', color: '#e0e0e0', minHeight: '100vh' }}>
            <h2>Lesson Map: Blender 5.0 Manual</h2>
            <div className="chapter-list">
                {chapters.map((chapter, index) => (
                    <TreeNode key={index} node={chapter} />
                ))}
            </div>
        </div>
    );
};

export default LessonMap;
