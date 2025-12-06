export interface Question {
  id: number;
  text: string;
  answer: string;
  targetLetter: string;
}

export interface GameData {
  solution: string;
  questions: Question[];
}

export enum GameState {
  START = 'START',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  PUZZLE = 'PUZZLE',
  WIN = 'WIN',
  LOSE = 'LOSE',
}

export interface UserAnswer {
  questionId: number;
  answer: string;
}
