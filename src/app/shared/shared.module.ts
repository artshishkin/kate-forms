import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownDirective} from "./dropdown.directive";
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {AlertComponent} from "./alert/alert.component";
import {PlaceholderDirective} from "./placeholder.directive";

@NgModule({
  declarations: [
    DropdownDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DropdownDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective,
    CommonModule
  ],
  providers: []
})
export class SharedModule {
}
