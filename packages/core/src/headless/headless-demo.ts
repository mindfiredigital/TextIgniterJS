import {
  initHeadless,
  setContent,
  toggleBold,
  getContentHtml,
} from './headless';

initHeadless();
setContent('Hello world');
toggleBold(6, 11);
console.log(getContentHtml());
