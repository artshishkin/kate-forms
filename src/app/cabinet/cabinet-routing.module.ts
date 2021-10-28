import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {CabinetComponent} from "./cabinet.component";
import {AuthGuard} from "../auth/auth.guard";
import {CabinetDataResolver} from "./cabinet-data.resolver";

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    children: [
      {path: ':id', component: CabinetComponent, resolve: {cabinetData: CabinetDataResolver}},
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
