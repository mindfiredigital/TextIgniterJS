import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TextIgniterJS',
  tagline: 'A lightweight, powerful, and intuitive HTML editor built using TypeScript.',
  favicon: 'img/favicon.ico',

  // Set the production URL of your site here
  url: 'https://mindfiredigital.github.io', // Your GitHub Pages URL
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/TextIgniterJS/', // The root URL for the site

  // GitHub pages deployment config.
  organizationName: 'mindfiredigital', // Your GitHub org/user name.
  projectName: 'TextIgniterJS', // Your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/mindfiredigital/TextIgniterJS/edit/main/',
        },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   editUrl:
        //     'https://github.com/mindfiredigital/TextIgniterJS/edit/main/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'TextIgniterJS',
        logo: {
          alt: 'TextIgniterJS Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          // { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://www.npmjs.com/package/@mindfiredigital/textigniterjs',
            position: 'right',
            html: `
              <a href="https://www.npmjs.com/package/@mindfiredigital/textigniterjs" style="display: flex; align-items: center;">
                <img src="https://img.shields.io/npm/v/@mindfiredigital/textigniterjs.svg" alt="npm version" style="vertical-align: middle; margin-right: 5px;" />
                <img src="https://img.shields.io/npm/dt/@mindfiredigital/textigniterjs.svg" alt="total downloads" style="vertical-align: middle;" />
              </a>
            `,
          },
          {
            href: 'https://github.com/mindfiredigital/TextIgniterJS',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',

        copyright: `Copyright © ${new Date().getFullYear()} mindfiredigital/TextIgniterJS.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
