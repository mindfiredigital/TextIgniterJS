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
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
@Component({
  selector: 'ngx-text-igniter',
  template: '<text-igniter></text-igniter>',
  standalone: false
})
export class TextIgniterComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() config: any;

  builderRef?: HTMLElement;

  constructor(private elementRef: ElementRef) {
    console.log("constructor::", this.config);
  }

  ngOnInit(): void {
    console.log("calling init");
    import('@mindfiredigital/textigniter-web-component' as any
    )
      .then(() => {
        console.log('Web component loaded successfully.');
      })
      .catch((error) => {
        console.error('Failed to load web component:', error);
      });
  }

  ngAfterViewInit(): void {
    this.builderRef = this.elementRef.nativeElement.querySelector('text-igniter');
    if (this.config && this.builderRef) {
      try {
        const configString = JSON.stringify(this.config);
        console.log("ngAfterViewInit",configString)
        this.builderRef.setAttribute('config', configString.replace(/"/g, "'"));
      } catch (error) {
        console.error('Error setting config-data:', error);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges called:", changes);
    if (changes['config'] && this.builderRef) {
      try {
        const configString = JSON.stringify(this.config);
        console.log("ngOnChanges",configString)
        this.builderRef.setAttribute('config', configString.replace(/"/g, "'"));
      } catch (error) {
        console.error('Error updating config-data:', error);
      }
    }
  }
}