import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextIgniterModule } from 'text-igniter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TextIgniterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'demo-app';
  htmlContent = '';
  textContent = '';

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
      'loadHtmlContent',
    ],
  };

  onContentChange(data: { html: string; text: string }) {
    console.log('Content changed:', data);
    this.htmlContent = data.html;
    this.textContent = data.text;
  }

  get characterCount(): number {
    return this.textContent.length;
  }

  get wordCount(): number {
    return this.textContent.trim()
      ? this.textContent.trim().split(/\s+/).length
      : 0;
  }
}
