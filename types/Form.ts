export interface FormType {
  id: string;
  userId: string;
  title: string;
  description?: string;
  private?: boolean;
  code?: string;
  open?: boolean;
  questions: QuestionType[];
}

export interface QuestionType {
  id: number;
  title: string;
  description?: string;
  optional?: boolean;
  type: "choice" | "multiple" | "short" | "long";
}
