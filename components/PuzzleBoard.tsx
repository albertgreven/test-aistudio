import React, { useState } from 'react';
import { GameData } from '../types';
import { Button } from './Button';

interface PuzzleBoardProps {
  gameData: GameData;
  userAnswers: string[];
  onGuessSolution: (guess: string) => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ 
  gameData, 
  userAnswers, 
  onGuessSolution 
}) => {
  // -1 means not revealed, 0 means revealed as '?', 1 means revealed as correct Letter
  const [revealState, setRevealState] = useState<number[]>(new Array(12).fill(-1));
  const [finalGuess, setFinalGuess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReveal = (index: number) => {
    if (revealState[index] !== -1) return; // Already revealed

    const userAnswer = userAnswers[index] || '';
    const correctAnswer = gameData.questions[index].answer;
    
    // Logic: Compare answers loosely. 
    // We check if the user's answer starts with the target letter AND shares strict similarity with the full answer
    // Or simpler: Check if the first letter matches the solution letter. 
    // Twee Voor Twaalf TV logic: You only get the letter if the answer is CORRECT. 
    // If answer is WRONG, you get a question mark on that spot.
    
    // Normalize
    const normUser = userAnswer.trim().toLowerCase();
    const normCorrect = correctAnswer.trim().toLowerCase();
    
    // Check if the answer is "correct enough"
    // Using simple inclusion or Levenshtein would be ideal, but for this demo, 
    // let's check if the first letter matches the target AND the length is somewhat similar (>2 chars)
    // or exact match.
    
    // To be generous: If the first letter matches the solution letter, we count it as "Letter Found",
    // UNLESS the user answer is obviously empty or totally wrong.
    // Let's stick to the prompt: "Als het fout was komt er een vraagteken".
    // We will verify against the generated full answer.
    
    const isCorrect = normUser === normCorrect || (normUser.length > 2 && normCorrect.includes(normUser));
    
    const newRevealState = [...revealState];
    newRevealState[index] = isCorrect ? 1 : 0;
    setRevealState(newRevealState);
  };

  const submitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalGuess.trim()) return;
    setIsSubmitting(true);
    onGuessSolution(finalGuess);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl font-bold text-twee-gold mb-8">Het Puzzelmoment</h2>
      
      <p className="text-slate-300 mb-6 text-center">
        Klik op een nummer om de letter te kopen. <br/>
        <span className="text-sm text-slate-400">
          (Als je antwoord goed was, krijg je de letter. Anders een vraagteken.)
        </span>
      </p>

      {/* The 12 Letter Grid */}
      <div className="grid grid-cols-6 md:grid-cols-12 gap-3 mb-12">
        {gameData.solution.split('').map((char, idx) => {
          const status = revealState[idx]; // -1: hidden, 0: wrong(?), 1: correct(char)
          
          let content = idx + 1;
          let bgClass = "bg-slate-700 hover:bg-slate-600 cursor-pointer border-slate-500";
          let textClass = "text-slate-300 text-lg";

          if (status === 1) {
            content = char as any;
            bgClass = "bg-twee-gold border-yellow-300 cursor-default";
            textClass = "text-twee-dark font-extrabold text-2xl";
          } else if (status === 0) {
            content = '?' as any;
            bgClass = "bg-red-900 border-red-700 cursor-default";
            textClass = "text-red-200 font-bold text-xl";
          }

          return (
            <div
              key={idx}
              onClick={() => handleReveal(idx)}
              className={`w-12 h-16 md:w-14 md:h-20 border-2 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${bgClass} ${textClass}`}
            >
              {content}
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-lg bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-center text-white">Raad het woord</h3>
        <p className="text-xs text-center text-red-400 mb-4 uppercase tracking-widest font-bold">
          Let op: Je mag maar 1 keer raden!
        </p>
        
        <form onSubmit={submitGuess} className="flex flex-col gap-4">
          <input
            type="text"
            maxLength={12}
            value={finalGuess}
            onChange={(e) => setFinalGuess(e.target.value.toUpperCase())}
            className="w-full text-center tracking-[0.5em] uppercase text-2xl bg-slate-900 border-2 border-slate-600 rounded-lg py-4 text-white focus:border-twee-gold outline-none"
            placeholder="_ _ _ _ _ _ _ _ _ _ _ _"
          />
          <Button 
            type="submit" 
            disabled={finalGuess.length !== 12 || isSubmitting}
            className="w-full mt-2"
          >
            BEVESTIG OPLOSSING
          </Button>
        </form>
      </div>
      
      {/* Helper list of answers user gave */}
      <div className="mt-12 w-full max-w-2xl">
        <h4 className="text-slate-500 font-bold mb-4 uppercase text-xs tracking-wider">Jouw Antwoorden</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
            {userAnswers.map((ans, idx) => (
                <div key={idx} className="flex gap-2">
                    <span className="font-mono text-twee-gold w-6">{idx+1}.</span>
                    <span className="truncate">{ans || '-'}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
