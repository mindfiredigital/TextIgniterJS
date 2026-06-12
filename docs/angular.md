# Angular

TextIgniter provides an Angular module wrapper `@mindfiredigital/textigniter-angular` to integrate the editor into your Angular applications (supports Angular >= 19).

## Installation

Install the package via your preferred package manager:

```bash
# npm
npm install @mindfiredigital/textigniter-angular

# yarn
yarn add @mindfiredigital/textigniter-angular

# pnpm
pnpm add @mindfiredigital/textigniter-angular
```

Also import the core styles. You can add this line to your project's global `styles.css` / `styles.scss` or in the component style:

```css
@import '@mindfiredigital/textigniter/dist/styles/text-igniter.css';
```

## Quick Start

### Basic Usage

Import `TextIgniterModule` in your standalone component or Angular module:

```typescript
import { Component } from '@angular/core';
import { TextIgniterModule } from '@mindfiredigital/textigniter-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TextIgniterModule],
  template: `
    <ngx-text-igniter [config]="config"></ngx-text-igniter>
  `,
})
export class AppComponent {
  config = {
    showToolbar: true,
    features: ['bold', 'italic', 'underline', 'unorderedList', 'orderedList'],
  };
}
```

### With Real-time Content Updates

Listen to the `contentChange` event to get real-time content changes:

```typescript
import { Component } from '@angular/core';
import { TextIgniterModule } from '@mindfiredigital/textigniter-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TextIgniterModule],
  template: `
    <ngx-text-igniter 
      [config]="config" 
      (contentChange)="onContentChange($event)">
    </ngx-text-igniter>

    <div class="preview">
      <strong>HTML Content:</strong>
      <pre>{{ htmlContent }}</pre>
    </div>
  `,
})
export class AppComponent {
  htmlContent = '';
  textContent = '';

  config = {
    showToolbar: true,
    features: ['bold', 'italic', 'underline'],
  };

  onContentChange(data: { html: string; text: string }) {
    this.htmlContent = data.html;
    this.textContent = data.text;
  }
}
```

## API Reference

### Component Inputs

The `<ngx-text-igniter>` component accepts the following input properties:

| Input | Type | Description |
| :--- | :--- | :--- |
| `config` | `EditorConfig` | Configuration options for the editor. |
| `editorId` | `string` (Optional) | Custom ID for the editor element (Default: `'editor-ngId'`). |

### Component Outputs

| Output | Event Type | Description |
| :--- | :--- | :--- |
| `contentChange` | `EventEmitter<ContentChangeEvent>` | Emits when the editor content changes. |

### Event Structure (`ContentChangeEvent`)

```typescript
interface ContentChangeEvent {
  html: string; // Formatted HTML content
  text: string; // Plain text without HTML tags
}
```