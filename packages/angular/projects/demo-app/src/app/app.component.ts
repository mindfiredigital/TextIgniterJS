import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextIgniterModule } from 'text-igniter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TextIgniterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo-app';
  config = {
    showToolbar: true,
    features: [
      'bold',
      'italic',
      'underline',
      'hyperlink',
      'fontFamily',
      'fontSize',
      'alignLeft',
      'alignCenter',
      'alignRight',
      'unorderedList',
      'orderedList',
      'image',
      'fontColor',
      'bgColor',
      'getHtmlContent',
      'loadHtmlContent'
    ]
  }
}
