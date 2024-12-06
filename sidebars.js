// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Define the sidebar structure manually
  docsSidebar: [
    'introduction',
    'installation',
    {
      type: 'category',
      label: 'Configuration',
      items: ['javascript', 'react', 'angular'],
    },
    'contributing',
    'our-contributors',
  ],
};

export default sidebars;
