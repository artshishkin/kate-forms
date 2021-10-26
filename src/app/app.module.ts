import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CabinetComponent} from './cabinet/cabinet.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from "./app-routing.module";
import {DropdownDirective} from './shared/dropdown.directive';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    CabinetComponent,
    HeaderComponent,
    DropdownDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
