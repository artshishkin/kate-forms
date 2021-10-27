import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: '', redirectTo: '/cabinet/russian', pathMatch: 'full'},
  {path: 'cabinet', loadChildren: () => import('./cabinet/cabinet.module').then(m => m.CabinetModule)},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
