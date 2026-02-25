# @mindfiredigital/textigniter-angular

Angular wrapper component for TextIgniter - A powerful rich text editor for Angular applications.

[![npm version](https://badge.fury.io/js/@mindfiredigital%2Ftextigniter-angular.svg)](https://www.npmjs.com/package/@mindfiredigital/textigniter-angular)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Installation

```bash
npm install @mindfiredigital/textigniter-angular
```

Or using yarn:

```bash
yarn add @mindfiredigital/textigniter-angular
```

Or using pnpm:

```bash
pnpm add @mindfiredigital/textigniter-angular
```

## 🚀 Quick Start

### 1. Import the Module

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextIgniterModule } from '@mindfiredigital/textigniter-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TextIgniterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
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
      'loadHtmlContent',
    ],
  };
}
```

### 2. Use in Template

```html
<!-- app.component.html -->
<ngx-text-igniter [config]="config"></ngx-text-igniter>
```

## 🎯 Features

- ✅ Rich text editing with toolbar
- ✅ Bold, Italic, Underline, Strikethrough
- ✅ Font family and size customization
- ✅ Text and background color
- ✅ Text alignment (left, center, right)
- ✅ Lists (ordered and unordered)
- ✅ Hyperlinks
- ✅ Image insertion
- ✅ Undo/Redo functionality
- ✅ **Real-time content change events** 🆕
- ✅ TypeScript support
- ✅ Fully customizable

## 📚 API Reference

### Component Inputs

#### `config` (Required)

Configuration object for the editor.

```typescript
interface EditorConfig {
  showToolbar: boolean;
  features: string[];
}
```

**Available Features:**

- `'bold'` - Bold text
- `'italic'` - Italic text
- `'underline'` - Underline text
- `'strikethrough'` - Strikethrough text
- `'hyperlink'` - Add hyperlinks
- `'fontFamily'` - Change font family
- `'fontSize'` - Change font size
- `'fontColor'` - Change text color
- `'bgColor'` - Change background color
- `'alignLeft'` - Align text left
- `'alignCenter'` - Align text center
- `'alignRight'` - Align text right
- `'unorderedList'` - Create bullet lists
- `'orderedList'` - Create numbered lists
- `'image'` - Insert images
- `'getHtmlContent'` - Get HTML content button
- `'loadHtmlContent'` - Load HTML content button

#### `editorId` (Optional)

Custom ID for the editor element. Default: `'editor-ngId'`

```typescript
<ngx-text-igniter
  [config]="config"
  [editorId]="'my-custom-editor'">
</ngx-text-igniter>
```

### Component Outputs

#### `contentChange` 🆕

Emits whenever the editor content changes, providing both HTML and plain text.

```typescript
interface ContentChangeEvent {
  html: string; // HTML content
  text: string; // Plain text content (without HTML tags)
}
```

## 💡 Usage Examples

### Basic Example

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { TextIgniterModule } from '@mindfiredigital/textigniter-angular';

@Component({
  selector: 'app-root',
  imports: [TextIgniterModule],
  template: `<ngx-text-igniter [config]="config"></ngx-text-igniter>`,
})
export class AppComponent {
  config = {
    showToolbar: true,
    features: ['bold', 'italic', 'underline'],
  };
}
```

### Real-time Content Updates 🆕

Get notified whenever the content changes:

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { TextIgniterModule } from '@mindfiredigital/textigniter-angular';

@Component({
  selector: 'app-root',
  imports: [TextIgniterModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  htmlContent = '';
  textContent = '';

  config = {
    showToolbar: true,
    features: ['bold', 'italic', 'underline', 'fontColor', 'bgColor'],
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
```

```html
<!-- app.component.html -->
<h1>TextIgniter Angular Example</h1>

<ngx-text-igniter [config]="config" (contentChange)="onContentChange($event)">
</ngx-text-igniter>

<!-- Real-time Content Preview -->
<div class="preview-container">
  <h3>Real-time Content Preview:</h3>

  <div class="content-section">
    <strong>HTML Content:</strong>
    <pre>{{ htmlContent || 'Start typing to see content...' }}</pre>
  </div>

  <div class="content-section">
    <strong>Text Content:</strong>
    <pre>{{ textContent || 'Start typing to see text...' }}</pre>
  </div>

  <div class="stats">
    <strong>Stats:</strong>
    <p>Characters: {{ characterCount }} | Words: {{ wordCount }}</p>
  </div>
</div>
```

### Auto-Save Functionality

Implement auto-save with debouncing:

```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  template: `
    <ngx-text-igniter
      [config]="config"
      (contentChange)="onContentChange($event)"
    >
    </ngx-text-igniter>
    <p *ngIf="lastSaved">Last saved: {{ lastSaved | date: 'medium' }}</p>
  `,
})
export class EditorComponent implements OnDestroy {
  config = { showToolbar: true, features: ['bold', 'italic'] };
  lastSaved: Date | null = null;

  private contentChange$ = new Subject<{ html: string; text: string }>();

  constructor() {
    // Auto-save after 2 seconds of inactivity
    this.contentChange$
      .pipe(debounceTime(2000))
      .subscribe(data => this.saveContent(data));
  }

  onContentChange(data: { html: string; text: string }) {
    this.contentChange$.next(data);
  }

  saveContent(data: { html: string; text: string }) {
    // Save to backend
    console.log('Saving content...', data);
    this.lastSaved = new Date();

    // Example: Call your API
    // this.http.post('/api/save', data).subscribe();
  }

  ngOnDestroy() {
    this.contentChange$.complete();
  }
}
```

### Form Integration

Use with Angular Reactive Forms:

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <ngx-text-igniter
        [config]="config"
        (contentChange)="onContentChange($event)"
      >
      </ngx-text-igniter>

      <button type="submit" [disabled]="!form.valid">Submit</button>
    </form>
  `,
})
export class FormComponent {
  form: FormGroup;

  config = {
    showToolbar: true,
    features: ['bold', 'italic', 'underline'],
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      content: ['', Validators.required],
    });
  }

  onContentChange(data: { html: string; text: string }) {
    this.form.patchValue({ content: data.html });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form data:', this.form.value);
      // Submit to backend
    }
  }
}
```

### Custom Editor ID

Use a custom ID for multiple editors:

```typescript
@Component({
  template: `
    <ngx-text-igniter
      [config]="config"
      [editorId]="'editor-1'"
      (contentChange)="onEditor1Change($event)"
    >
    </ngx-text-igniter>

    <ngx-text-igniter
      [config]="config"
      [editorId]="'editor-2'"
      (contentChange)="onEditor2Change($event)"
    >
    </ngx-text-igniter>
  `,
})
export class MultiEditorComponent {
  config = { showToolbar: true, features: ['bold', 'italic'] };

  onEditor1Change(data: { html: string; text: string }) {
    console.log('Editor 1:', data);
  }

  onEditor2Change(data: { html: string; text: string }) {
    console.log('Editor 2:', data);
  }
}
```

## 🔧 Development

### Building the Library

To build the library, run:

```bash
ng build text-igniter
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:

   ```bash
   cd dist/text-igniter
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish --access public
   ```

### Running Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running the Demo App

To run the demo application:

```bash
ng serve demo-app
```

Navigate to `http://localhost:4200/` to see the editor in action.

## 📋 Requirements

- Angular >= 19.0.0
- TypeScript >= 5.7.0
- Node.js >= 12.0.0

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@mindfiredigital/textigniter-angular)
- [GitHub Repository](https://github.com/mindfiredigital/textigniterjs)
- [Documentation](https://github.com/mindfiredigital/textigniterjs/tree/main/docs)
- [Core Package](https://www.npmjs.com/package/@mindfiredigital/textigniter)
- [React Package](https://www.npmjs.com/package/@mindfiredigital/textigniter-react)
- [Web Component](https://www.npmjs.com/package/@mindfiredigital/textigniter-web-component)

## 📞 Support

For issues, questions, or suggestions:

- [GitHub Issues](https://github.com/mindfiredigital/textigniterjs/issues)
- [Discussions](https://github.com/mindfiredigital/textigniterjs/discussions)

## 🎉 What's New

### v1.2.0

- ✨ Added `contentChange` event emitter for real-time content updates
- 🐛 Fixed clipboard permission error
- 📚 Updated documentation and examples
- 🔧 Improved TypeScript support

---

Made with ❤️ by [Mindfire Digital](https://github.com/mindfiredigital)
