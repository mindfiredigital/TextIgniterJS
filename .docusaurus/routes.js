import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/TextIgniterJS/markdown-page',
    component: ComponentCreator('/TextIgniterJS/markdown-page', 'd18'),
    exact: true
  },
  {
    path: '/TextIgniterJS/docs',
    component: ComponentCreator('/TextIgniterJS/docs', '848'),
    routes: [
      {
        path: '/TextIgniterJS/docs',
        component: ComponentCreator('/TextIgniterJS/docs', '196'),
        routes: [
          {
            path: '/TextIgniterJS/docs',
            component: ComponentCreator('/TextIgniterJS/docs', '6c5'),
            routes: [
              {
                path: '/TextIgniterJS/docs/angular',
                component: ComponentCreator('/TextIgniterJS/docs/angular', '6d0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/TextIgniterJS/docs/contributing',
                component: ComponentCreator('/TextIgniterJS/docs/contributing', 'fc9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/TextIgniterJS/docs/installation',
                component: ComponentCreator('/TextIgniterJS/docs/installation', '19c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/TextIgniterJS/docs/introduction',
                component: ComponentCreator('/TextIgniterJS/docs/introduction', 'bee'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/TextIgniterJS/docs/javascript',
                component: ComponentCreator('/TextIgniterJS/docs/javascript', 'fa2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/TextIgniterJS/docs/our-contributors',
                component: ComponentCreator('/TextIgniterJS/docs/our-contributors', '1e3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/TextIgniterJS/docs/react',
                component: ComponentCreator('/TextIgniterJS/docs/react', '344'),
                exact: true,
                sidebar: "docsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/TextIgniterJS/',
    component: ComponentCreator('/TextIgniterJS/', '246'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
