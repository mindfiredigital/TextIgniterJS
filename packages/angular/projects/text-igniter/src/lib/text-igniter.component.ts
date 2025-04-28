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
  template: '<div [id]="editorId"></div>',
  standalone: false,
})
export class TextIgniterComponent implements OnChanges, AfterViewInit {
  @Input() config:
    | {
        showToolbar: boolean;
        features: string[];
      }
    | undefined;
  @Input() editorId: string | 'editor1' = 'editor1';
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
      return console.log("editorId can't be 'editor'");
    }
    if (this.config) {
      new TextIgniter(this.editorId, this.config);
    }
  }
}
