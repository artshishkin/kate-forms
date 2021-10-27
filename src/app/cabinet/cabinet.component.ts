import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CabinetService} from "./cabinet.service";
import {Subscription} from "rxjs";
import {Question} from "../shared/question.model";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
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

    let subscription = this.route.paramMap.subscribe(paramMap => {
      this.cabinetId = paramMap.get('id');
      this.cabinetName = this.cabinetService.getName(this.cabinetId);
      this.questions = this.cabinetService.getQuestions(this.cabinetId);
      this.initForm();
    });
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
    for (const question of this.questions) {
      const questionGroup: FormGroup = this.initQuestionGroup(question);
      questionsArray.push(questionGroup);
    }
    return this.formBuilder.array(questionsArray);
  }

  private initQuestionGroup(question: Question): FormGroup {
    if (question.questionComplexity === QuestionComplexity.SIMPLE) {
      const q1 = question.assessmentType === AssessmentType.BOOL ?
        {isPresent: this.formBuilder.control(false, Validators.required)} :
        {quantity: this.formBuilder.control('0', [Validators.required, Validators.min(0)])};

      const q2 = question.lifetimeType === LifetimeType.CHOICE ?
        {choiceLifetime: this.formBuilder.control(this.choiceLifetimeVariants[1])} :
        {manualLifetime: this.formBuilder.control('')};

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
