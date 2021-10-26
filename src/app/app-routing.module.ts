import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {CabinetComponent} from "./cabinet/cabinet.component";

const routes: Routes = [
  {path: '', redirectTo: '/cabinet/russian', pathMatch: 'full'},
  {path: 'cabinet/russian', component: CabinetComponent},
  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
