import React, { useState, useCallback } from 'react';
import { GameData, GameState } from './types';
import { generateQuiz } from './services/geminiService';
import { StartScreen } from './components/StartScreen';
import { QuestionCard } from './components/QuestionCard';
import { PuzzleBoard } from './components/PuzzleBoard';
import { Button } from './components/Button';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startGame = async () => {
    setGameState(GameState.LOADING);
    setError(null);
    try {
      const data = await generateQuiz();
      setGameData(data);
      setUserAnswers(new Array(12).fill(''));
      setCurrentQuestionIdx(0);
      setGameState(GameState.QUIZ);
    } catch (e) {
      console.error(e);
      setError("Kon de quiz niet laden. Controleer je internetverbinding of API key en probeer het opnieuw.");
      setGameState(GameState.START);
    }
  };

  const handleAnswer = (answer: string) => {
    if (!gameData) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIdx] = answer;
    setUserAnswers(newAnswers);

    if (currentQuestionIdx < 11) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setGameState(GameState.PUZZLE);
    }
  };

  const handleFinalGuess = (guess: string) => {
    if (!gameData) return;
    
    // Check win condition
    const cleanGuess = guess.trim().toUpperCase();
    const cleanSolution = gameData.solution.trim().toUpperCase();
    
    if (cleanGuess === cleanSolution) {
      setGameState(GameState.WIN);
    } else {
      setGameState(GameState.LOSE);
    }
  };

  return (
    <div className="min-h-screen bg-twee-dark text-white p-4 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-5xl py-6 flex justify-between items-center border-b border-slate-800 mb-8">
        <div className="font-bold text-twee-gold text-2xl tracking-tighter">
          12<span className="text-white mx-1">/</span>12
        </div>
        {gameState === GameState.QUIZ && (
          <div className="text-sm font-medium text-slate-400">
             Vraag {currentQuestionIdx + 1} van 12
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl flex-grow flex flex-col items-center justify-center">
        
        {gameState === GameState.START && (
          <>
            <StartScreen onStart={startGame} />
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
                {error}
              </div>
            )}
          </>
        )}

        {gameState === GameState.LOADING && (
          <div className="flex flex-col items-center space-y-4 animate-pulse">
            <div className="w-16 h-16 border-4 border-twee-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-twee-gold">De notaris genereert de vragen...</p>
          </div>
        )}

        {gameState === GameState.QUIZ && gameData && (
          <QuestionCard
            question={gameData.questions[currentQuestionIdx]}
            totalQuestions={12}
            onAnswer={handleAnswer}
            savedAnswer={userAnswers[currentQuestionIdx]}
          />
        )}

        {gameState === GameState.PUZZLE && gameData && (
          <PuzzleBoard
            gameData={gameData}
            userAnswers={userAnswers}
            onGuessSolution={handleFinalGuess}
          />
        )}

        {gameState === GameState.WIN && gameData && (
          <div className="text-center animate-bounce-in">
            <h2 className="text-6xl font-extrabold text-green-500 mb-4">GEWONNEN!</h2>
            <p className="text-2xl text-white mb-8">Het woord was inderdaad <span className="text-twee-gold font-bold">{gameData.solution}</span></p>
            <Button onClick={startGame}>Nog een keer spelen</Button>
          </div>
        )}

        {gameState === GameState.LOSE && gameData && (
          <div className="text-center">
            <h2 className="text-6xl font-extrabold text-red-500 mb-4">HELAAS...</h2>
            <p className="text-2xl text-white mb-8">Dat was niet correct.</p>
            <div className="bg-slate-800 p-6 rounded-lg mb-8 inline-block">
              <p className="text-slate-400 mb-2">Het juiste woord was:</p>
              <p className="text-4xl text-twee-gold font-bold tracking-[0.5em]">{gameData.solution}</p>
            </div>
            <div className="block">
                <Button onClick={startGame} variant="outline">Opnieuw proberen</Button>
            </div>
          </div>
        )}

      </main>
      
      <footer className="w-full py-6 text-center text-slate-600 text-sm mt-auto">
        &copy; {new Date().getFullYear()} Twee voor Twaalf Quiz App • Powered by Gemini
      </footer>
    </div>
  );
}
