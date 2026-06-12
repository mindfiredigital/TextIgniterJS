# Our Contributors

We want to extend our heartfelt gratitude to the contributors who have made `@mindfiredigital/TextIgniterJS` possible.

<!-- truncate -->

## Contributors List

import React from 'react';

export function Contributors() {
const contributorsData = {
  
  'lakin-mohapatra': {
    name: 'Lakin Mohapatra',
    title: 'Tech Lead @ Mindfire Solutions',
    url: 'https://github.com/lakinmindfire',
    image_url: 'https://github.com/lakinmindfire.png',
  },
  'Vicky-Sharma': {
    name: 'Vicky Sharma',
    title: 'Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/vickysmf',
    image_url: 'https://github.com/vickysmf.png',
  },
  'sarada-sahoo': {
    name: 'Sarada prasad biswal',
    title: 'Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/saradab-mindfire',
    image_url: 'https://github.com/saradab-mindfire.png',
  },
  'deepak-yadav': {
    name: 'Deepak Yadav',
    title: 'Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/deepakyadav-01',
    image_url: 'https://github.com/deepakyadav-01.png',
  },
  'sobhan-sahoo': {
    name: 'Sobhan Sahoo',
    title: 'Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/sobhan-s',
    image_url: 'https://github.com/sobhan-s.png',
  },
  'subhendu-swain': {
    name: 'Subhendu Swain',
    title: 'Senior Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/SubhenduS1999',
    image_url: 'https://github.com/SubhenduS1999.png',
  },
  'jagdish-pal': {
    name: 'Jagdish Pal',
    title: 'Senior Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/jagdish-mindfire',
    image_url: 'https://github.com/jagdish-mindfire.png',
  },
  'parth-dhemeliya': {
    name: 'Parth Dhemeliya',
    title: 'Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/ParthDhemeliya',
    image_url: 'https://github.com/ParthDhemeliya.png',
  },
  'Paras-Bhatia': {
    name: 'Paras Bhatia',
    title: 'Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/ParasMindfire',
    image_url: 'https://github.com/ParasMindfire.png',
  },
  'Jyoti-Prakash-Panda': {
    name: 'Jyoti Prakash Panda',
    title: 'Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/jyotiprakashmfsi',
    image_url: 'https://github.com/jyotiprakashmfsi.png',
  },
  'Mohd-Aasim ': {
    name: 'Mohd Aasim ',
    title: 'Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/MohdAasim',
    image_url: 'https://github.com/MohdAasim.png',
  },
  'rohitrg-96': {
    name: 'rohitrg',
    title: 'Software Engineer @ Mindfire Solutions',
    url: 'https://github.com/rohitrg96',
    image_url: 'https://github.com/rohitrg96.png',
  },
  
  
};

return (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px',
    margin: '2rem 0'
  }}>
    {Object.entries(contributorsData).map(([key, contributor]) => (
      <div key={key} style={{
        backgroundColor: 'var(--ifm-card-background-color, #ffffff)',
        border: '1px solid var(--ifm-toc-border-color, #ebedf0)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
      }}
      className="contributor-card"
      >
        <img
          src={contributor.image_url}
          alt={contributor.name}
          style={{
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            border: '3px solid var(--ifm-color-primary, #e62e2d)',
            marginBottom: '16px',
            objectFit: 'cover'
          }}
        />
        <h3 style={{ 
          fontSize: '1.15rem', 
          fontWeight: '700', 
          margin: '0 0 6px 0', 
          color: 'var(--ifm-font-color-base, #1c1e21)' 
        }}>
          {contributor.name}
        </h3>
        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--ifm-color-emphasis-700, #57606a)', 
          margin: '0 0 20px 0', 
          minHeight: '36px', 
          lineHeight: '1.4' 
        }}>
          {contributor.title}
        </p>
        <a
          href={contributor.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 18px',
            borderRadius: '6px',
            backgroundColor: 'var(--ifm-color-primary, #e62e2d)',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
        >
          GitHub Profile
        </a>
      </div>
    ))}
  </div>
);
}

<Contributors />
