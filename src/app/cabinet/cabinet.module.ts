import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {SharedModule} from "../shared/shared.module";
import {CabinetComponent} from "./cabinet.component";
import {CabinetRoutingModule} from "./cabinet-routing.module";

@NgModule({
  declarations: [
    CabinetComponent
  ],
  imports: [
    ReactiveFormsModule,
    CabinetRoutingModule,
    SharedModule,
    CommonModule
  ]
})
export class CabinetModule {
}
