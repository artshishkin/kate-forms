import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";

import {DataStorageService} from "../shared/data-storage.service";
import {AuthResponseData, AuthService} from "../auth/auth.service";
import * as DataStore from "../auth/data-store";
import {PlaceholderDirective} from "../shared/placeholder.directive";
import {AlertComponent} from "../shared/alert/alert.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  isLoading = false;

  error: string = null;

  subs: Subscription[] = [];

  profileUserData: any = null;

  federalDistricts: string[] = DataStore.federalDistricts;
  private federalSubjectsMap = DataStore.federalSubjects;
  federalSubjects: string[] = [];

  constructor(private  authService: AuthService,
              private router: Router,
              private dataStorageService: DataStorageService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    let subscription = this.dataStorageService.getUserData()
      .subscribe(userData => {
        this.profileUserData = userData;
        this.onChangeDistrict(this.profileUserData['organization-federal-district']);
      });
    this.subs.push(subscription);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    console.log(form);

    const formValue = {
      ...form.value,
      email: this.profileUserData?.email,
      password: null
    };

    console.log(formValue);

    this.isLoading = true;

    let authObs: Observable<AuthResponseData> = this.dataStorageService.storeUserData(formValue);

    let subscription = authObs
      .subscribe(
        data => {
          console.log(data);
          this.profileUserData = data;
          this.isLoading = false;
        },
        errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
          this.showErrorAlert(errorMessage);
        }
      );

    this.subs.push(subscription);
  }

  onCancel(form: NgForm) {
    this.onChangeDistrict(this.profileUserData['organization-federal-district']);
    form.reset({...this.profileUserData});
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

  onChangeDistrict(district: string) {
    this.federalSubjects = this.federalSubjectsMap.get(district);
  }
}
