import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {AuthComponent} from "./auth.component";
import {SharedModule} from "../shared/shared.module";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: AuthComponent}
    ])
  ],
  exports: [
    HttpClientModule
  ]
})
export class AuthModule {
}
