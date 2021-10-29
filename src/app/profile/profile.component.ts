import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";

import {DataStorageService} from "../shared/data-storage.service";
import {AuthResponseData, AuthService} from "../auth/auth.service";
import * as DataStore from "../auth/data-store";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild('profileForm') profileForm: NgForm;

  isLoading = false;

  error: string = null;

  subs: Subscription[] = [];

  profileUserData: any = null;

  federalDistricts: string[] = DataStore.federalDistricts;
  private federalSubjectsMap = DataStore.federalSubjects;
  federalSubjects: string[] = [];

  constructor(private  authService: AuthService,
              private router: Router,
              private dataStorageService: DataStorageService) {
  }

  ngOnInit(): void {
    let subscription = this.dataStorageService.getUserData()
      .subscribe(userData => {
        this.profileUserData = userData;
        this.onChangeDistrict(this.profileUserData['organization-federal-district']);
        this.profileForm.reset({...userData});
      });
    this.subs.push(subscription);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onSubmit() {
    if (!this.profileForm?.valid) return;

    const formValue = {
      ...this.profileForm.value,
      email: this.profileUserData?.email,
      password: null
    };

    this.isLoading = true;

    let storeObs: Observable<AuthResponseData> = this.dataStorageService.storeUserData(formValue);

    let subscription = storeObs
      .subscribe(
        data => {
          this.profileUserData = data;
          this.profileForm.reset({...this.profileUserData});
          this.isLoading = false;
        },
        errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
        }
      );

    this.subs.push(subscription);
  }

  onCancel() {
    this.onChangeDistrict(this.profileUserData['organization-federal-district']);
    this.profileForm?.reset({...this.profileUserData});
  }

  onClearError() {
    this.error = null;
  }

  onChangeDistrict(district: string) {
    this.federalSubjects = this.federalSubjectsMap.get(district);
  }
}
