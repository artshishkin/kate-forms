import {LifetimeType} from "./lifetime-type.enum";
import {AssessmentType} from "./assessment-type.enum";
import {QuestionComplexity} from "./question-complexity.enum";

export class Question {

  id: string;
  name: string;
  description?: string;
  lifetimeType: LifetimeType;
  assessmentType: AssessmentType;

  questionComplexity: QuestionComplexity = QuestionComplexity.SIMPLE;
  required: boolean = true;

}
