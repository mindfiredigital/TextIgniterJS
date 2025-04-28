// import { Component } from '@angular/core';

// @Component({
//   selector: 'text-igniter',
//   templateUrl: './text-igniter.component.html',
//   styles: ``,
//   standalone: false
// })
// export class TextIgniterComponent {

// }

import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { TextIgniter } from '@mindfiredigital/textigniter/dist/TextIgniter';

@Component({
  selector: 'ngx-text-igniter',
  templateUrl: './text-igniter.component.html',
  standalone: false,
})
export class TextIgniterComponent implements OnChanges, AfterViewInit {
  @Input() config:
    | {
      showToolbar: boolean;
      features: string[];
    }
    | undefined;
  @Input() editorId: string | 'editor-ngId' = 'editor-ngId';
  ngAfterViewInit(): void {
    this.renderTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.renderTable();
    }
  }

  private renderTable(): void {
    if (this.editorId === 'editor') {
      return console.log("editor-ngId can't be using name as id='editor' ");
    }
    if (this.config) {
      new TextIgniter(this.editorId, this.config);
    }
  }
}