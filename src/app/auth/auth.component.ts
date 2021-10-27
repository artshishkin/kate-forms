import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  isLoginMode = true;

  isLoading = false;

  error: string = null;

  subs: Subscription[] = [];

  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  constructor(private  authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;

    let authObs: Observable<AuthResponseData> = this.isLoginMode ?
      this.authService.login(form.value.email, form.value.password) :
      this.authService.signUp(form.value.email, form.value.password);

    authObs
      .subscribe(
        data => {
          console.log(data);
          this.isLoading = false;
          this.router.navigate(["/"]);
        },
        errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
          this.showErrorAlert(errorMessage);
        }
      );

    form.reset();
  }

  onClearError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    const subscription = componentRef.instance.close.subscribe(() => {
      subscription.unsubscribe();
      hostViewContainerRef.clear();
      this.onClearError();
    });
    this.subs.push(subscription);
  }
}