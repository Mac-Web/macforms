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

export type QuestionTypeMap = {
  multiple: {
    choices: ChoiceType[];
    multiple?: boolean;
  };
  text: {
    placeholder: string;
    long?: boolean;
  };
};

export type Question = keyof QuestionTypeMap;

export type QuestionType = {
  [K in Question]: {
    id: number;
    title: string;
    description?: string;
    optional?: boolean;
    type: K;
  } & QuestionTypeMap[K];
}[Question];

export interface ChoiceType {
  id: string;
  text: string;
}
