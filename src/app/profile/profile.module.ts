import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

import {SharedModule} from "../shared/shared.module";
import {ProfileComponent} from './profile.component';
import {FormsModule} from "@angular/forms";
import {AuthGuard} from "../auth/auth.guard";

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      {path: '', component: ProfileComponent, canActivate: [AuthGuard]}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileModule {
}
