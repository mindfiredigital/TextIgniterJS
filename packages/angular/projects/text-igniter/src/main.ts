import { bootstrapApplication } from '@angular/platform-browser';
import { TextIgniterComponent } from './lib/text-igniter.component';

import('@mindfiredigital/textigniter-web-component' as any)
  .then(() => {
    console.log('Web component loaded.');
    // Then bootstrap Angular
    bootstrapApplication(TextIgniterComponent)
  })
  .catch((err) => console.error(err));