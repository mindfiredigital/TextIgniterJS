import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TextIgniterModule } from '../../../text-igniter/src/public-api';

// Import your library module


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TextIgniterModule // Add your library module here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}