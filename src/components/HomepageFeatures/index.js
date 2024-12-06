import React from 'react';
import { Code, Zap, Palette } from 'lucide-react';
import './style.css';

const RichTextEditorDocs = () => {

  const featureHighlights = [
    {
      icon: <Code color="#e62e2d" size={48} />,
      title: 'Pure TypeScript',
      description: 'Built from ground up using TypeScript, ensuring type safety and clean, maintainable code.'
    },
    {
      icon: <Zap color="#e62e2d" size={48} />,
      title: 'Lightweight',
      description: 'Minimal bundle size under 50 KB, optimized for performance without compromising features.'
    },
    {
      icon: <Palette color="#e62e2d" size={48} />,
      title: 'Highly Customizable',
      description: 'Flexible configuration and theming options to match any design requirement.'
    }
  ];

  
  return (
    <div className="docs-container">

      <div className="features-grid">
        {featureHighlights.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card"
            data-feature-index={index}
          >
            <div className="feature-icon">
              {feature.icon}
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RichTextEditorDocs;