import React, { useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { TextIgniter } from "@mindfiredigital/react-text-igniter";
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import './style.css';

const HomePage = () => {
  const { siteConfig } = useDocusaurusContext();
  const editorRef = useRef(null);

  // Define features for the TextIgniter editor
  const features = [
    "heading",
    "bold",
    "italic",
    "underline",
    "orderedList",
    "unorderedList",
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    "createLink",
    "insertImage",
    "superscript",
    "subscript",
    "table",
    "layout",
  ];

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="TextIgniterJS - A lightweight, powerful, and intuitive HTML editor built using TypeScript."
    >
      <div className="homepage-container">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">{siteConfig.title}</h1>
            <p className="hero-tagline">{siteConfig.tagline}</p>
            <div className="hero-buttons">
              <Link
                to="/docs/installation"
                className="btn btn-primary"
              >
                Get Started
              </Link>
              <Link
                to="/docs/introduction"
                className="btn btn-secondary"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="editor-preview">
            <TextIgniter 
              ref={editorRef} 
              features={features} 
              height={"400px"} 
            />
          </div>
        </div>
        <HomepageFeatures />
      </div>
    </Layout>
  );
};

export default HomePage;