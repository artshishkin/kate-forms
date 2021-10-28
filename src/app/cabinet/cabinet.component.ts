import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {mergeMap, tap} from "rxjs/operators";

import {CabinetService} from "./cabinet.service";
import {Question} from "../shared/question.model";
import {AssessmentType} from "../shared/assessment-type.enum";
import {LifetimeType} from "../shared/lifetime-type.enum";
import {QuestionComplexity} from "../shared/question-complexity.enum";
import {DataStorageService} from "../shared/data-storage.service";
import {CabinetData} from "../shared/cabinet-data.model";

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit, OnDestroy {

  cabinetId: string = null;
  cabinetName: string = null;
  questions: Question[] = [];
  cabinetForm: FormGroup;

  //todo May be delete it???
  cabinetData: CabinetData;

  choiceLifetimeVariants: string[] = ['до 5 лет', 'от 5 до 10 лет', 'более 10 лет'];

  private subs: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private cabinetService: CabinetService,
              private dataStorageService: DataStorageService
  ) {
  }

  ngOnInit(): void {

    this.cabinetId = this.route.snapshot.paramMap.get('id');
    this.cabinetName = this.cabinetService.getName(this.cabinetId);

    let subscription = this.route.paramMap
      .pipe(
        tap(paramMap => {
          this.cabinetId = paramMap.get('id');
          this.cabinetName = this.cabinetService.getName(this.cabinetId);
          this.questions = this.cabinetService.getQuestions(this.cabinetId);
        }),
        mergeMap(() => this.route.data),
        tap(data => this.cabinetData = data['cabinetData'])
      )
      .subscribe(() => this.initForm());

    this.subs.push(subscription);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private initForm() {
    this.cabinetForm = this.formBuilder.group({
      questions: this.initQuestionArray()
    });
  }

  private initQuestionArray(): FormArray {
    const questionsArray = [];
    for (let i = 0; i < this.questions.length; i++) {
      let question = this.questions[i];
      const questionGroup: FormGroup = this.initQuestionGroup(question, i);
      questionsArray.push(questionGroup);
    }
    return this.formBuilder.array(questionsArray);
  }

  private initQuestionGroup(question: Question, index: number): FormGroup {
    if (question.questionComplexity === QuestionComplexity.SIMPLE) {
      let q1: any;
      if (question.assessmentType === AssessmentType.BOOL) {
        q1 = {isPresent: this.formBuilder.control(!!this.cabinetData?.questions[index]?.isPresent, Validators.required)};
      } else {
        const isQuantityPresent = !!this.cabinetData?.questions[index]?.quantity;
        const quantity = isQuantityPresent ? this.cabinetData?.questions[index]?.quantity : 0;
        q1 = {quantity: this.formBuilder.control(quantity, [Validators.required, Validators.min(0)])};
      }

      let q2: any;
      if (question.lifetimeType === LifetimeType.CHOICE) {
        const isChoiceLifetimePresent: boolean = !!this.cabinetData?.questions[index]?.choiceLifetime;
        const choiceLifetime = isChoiceLifetimePresent ?
          this.cabinetData?.questions[index]?.choiceLifetime :
          this.choiceLifetimeVariants[1];
        q2 = {choiceLifetime: this.formBuilder.control(choiceLifetime)};
      } else {
        const isManualLifetimePresent = this.cabinetData?.questions[index]?.manualLifetime;
        const manualLifetime = isManualLifetimePresent ?
          this.cabinetData?.questions[index]?.manualLifetime :
          new Date().getFullYear();
        q2 = {manualLifetime: this.formBuilder.control(manualLifetime)};
      }
      return this.formBuilder.group({...q1, ...q2});

    } else {
      return this.formBuilder.group({
        additional: this.formBuilder.array([
          // this.formBuilder.group({
          //   name: this.formBuilder.control('art', Validators.required),
          //   description: this.formBuilder.control("It's my name", Validators.required),
          //   productionYear: this.formBuilder.control(1983, Validators.required),
          //   quantity: this.formBuilder.control(1, Validators.required),
          // })
        ])
      });
    }
  }

  get cabinetFormQuestions(): AbstractControl[] {
    return (<FormArray>this.cabinetForm.get('questions')).controls;
  }

  onSubmit() {
    console.log(this.cabinetForm);
    console.log(this.cabinetForm.value);
    this.dataStorageService.storeCabinetData(this.cabinetId, this.cabinetForm.value);
  }

  onCancel() {
    this.dataStorageService.fetchCabinetData(this.cabinetId);
  }

  onAddInstrument(formArray: AbstractControl) {
    (formArray as FormArray).push(
      this.formBuilder.group({
        name: this.formBuilder.control('', Validators.required),
        description: this.formBuilder.control("", Validators.required),
        productionYear: this.formBuilder.control('', Validators.required),
        quantity: this.formBuilder.control('', Validators.required),
      }));
  }

  getFormArrayControls(formArray: AbstractControl) {
    return (<FormArray>formArray).controls;
  }

  onDeleteInstrument(instrumentControl: AbstractControl, i: number) {
    (instrumentControl.parent as FormArray).removeAt(i);
  }
}
