import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from "@angular/common/http";

import {AuthInterceptor} from "./auth/auth.interceptor";

@NgModule({
  providers: [
    // CabinetService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ]
})
export class CoreModule {
}
