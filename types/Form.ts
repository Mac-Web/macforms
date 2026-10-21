import type { User } from "@/generated/prisma/client";

export interface FormType {
  id: string;
  shortened?: string;
  userId: string;
  title: string;
  description?: string;
  private?: boolean;
  code?: string;
  open?: boolean;
  quiz?: boolean;
  starred?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowMultipleResponses?: boolean;
  allowEditingResponses?: boolean;
  backgroundColor?: string;
  questions: QuestionType[];
  collaborators?: User[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResponseType {
  id: string;
  formId: string;
  answers: AnswerType[];
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type QuestionTypeMap = {
  multiple: {
    choices: ChoiceType[];
    multiple?: boolean; //FIXME: question is marked correct whenever just one option matches, check if its multiple has to match every correct option. or is it already fixed? idek the codebase is atrocious
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
    correct?: string[];
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

export interface SettingsType {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowMultipleResponses: boolean;
  allowEditingResponses: boolean;
  backgroundColor?: string;
}
