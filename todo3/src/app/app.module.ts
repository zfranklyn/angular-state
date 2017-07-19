import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemComponent } from './item/item.component';
import { InputComponent } from './input/input.component';

import { StateService } from './services/state.service';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    InputComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [StateService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
