import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {CabinetComponent} from "./cabinet.component";
import {AuthGuard} from "../auth/auth.guard";

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    children: [
      {path: ':id', component: CabinetComponent},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class CabinetRoutingModule {
}
