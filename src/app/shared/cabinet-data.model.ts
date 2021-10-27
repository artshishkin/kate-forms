export interface CabinetData {
  questions: QuestionData[];
}

export interface QuestionData {
  isPresent?: boolean;
  quantity?: number;
  choiceLifetime?: string;
  manualLifetime?: number;
  additional?: AdditionalData[];
}

export interface AdditionalData {
  name: string;
  description: string;
  productionYear: number;
  quantity: number;
}
