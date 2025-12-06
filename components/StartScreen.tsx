import React from 'react';
import { Button } from './Button';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
      <h1 className="text-6xl font-extrabold text-twee-gold tracking-wider drop-shadow-md">
        TWEE VOOR TWAALF
      </h1>
      <p className="text-xl text-gray-300 max-w-lg mx-auto leading-relaxed">
        Beantwoord 12 vragen. Verzamel de eerste letters. Raad het 12-letterige woord.
        Je mag één keer raden!
      </p>
      <div className="pt-8">
        <Button onClick={onStart} className="text-xl px-12 py-4">
          Start De Quiz
        </Button>
      </div>
    </div>
  );
};
