import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { Button } from './Button';

interface QuestionCardProps {
  question: Question;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  savedAnswer?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  totalQuestions, 
  onAnswer,
  savedAnswer = ''
}) => {
  const [input, setInput] = useState(savedAnswer);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput(savedAnswer);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id, savedAnswer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(input);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <span className="text-twee-gold font-bold text-xl">
          Vraag {question.id} / {totalQuestions}
        </span>
        <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-twee-gold transition-all duration-500"
            style={{ width: `${(question.id / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-8 text-white min-h-[5rem] flex items-center">
        {question.text}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-slate-400 mb-2">
            Jouw antwoord (De eerste letter telt)
          </label>
          <input
            ref={inputRef}
            id="answer"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-slate-900 border-2 border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-twee-gold transition-colors text-lg placeholder-slate-600"
            placeholder="Typ hier je antwoord..."
            autoComplete="off"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            {question.id === totalQuestions ? 'Naar Puzzel' : 'Volgende Vraag'}
          </Button>
        </div>
      </form>
    </div>
  );
};
