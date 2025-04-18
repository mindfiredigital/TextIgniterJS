import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextIgniterComponent } from './text-igniter.component';
@NgModule({
    declarations: [TextIgniterComponent],
    imports: [CommonModule],
    exports: [TextIgniterComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TextIgniterModule { }