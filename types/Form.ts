export interface FormType {
  id: string;
  userId: string;
  title: string;
  description?: string;
  private?: boolean;
  code?: string;
  open?: boolean;
  quiz?: boolean;
  questions: QuestionType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResponseType {
  id: string;
  formId: string;
  answers: AnswerType[];
  createdAt?: Date;
  updatedAt?: Date;
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

export type AnswerTypeMap = {
  multiple: {
    choices: string[];
  };
  text: {
    text: string;
  };
};

export type Question = keyof QuestionTypeMap;
export type Answer = keyof AnswerTypeMap;

export type QuestionType = {
  [K in Question]: {
    id: number;
    title: string;
    description?: string;
    optional?: boolean;
    correct?: string;
    type: K;
  } & QuestionTypeMap[K];
}[Question];

export type AnswerType = {
  [K in Answer]: {
    id: number;
    questionId: number;
    type: K;
  } & AnswerTypeMap[K];
}[Answer];

export interface ChoiceType {
  id: string;
  text: string;
}
