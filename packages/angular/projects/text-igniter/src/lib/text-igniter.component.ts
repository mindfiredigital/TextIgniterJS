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
  template: '<div id="editor"></div>',
  standalone: false,
})
export class TextIgniterComponent implements OnChanges, AfterViewInit {
  @Input() config:
    | {
        showToolbar: boolean;
        features: string[];
      }
    | undefined;
  ngAfterViewInit(): void {
    this.renderTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.renderTable();
    }
  }

  private renderTable(): void {
    if (this.config) {
      new TextIgniter('editor', this.config);
    }
  }
}
