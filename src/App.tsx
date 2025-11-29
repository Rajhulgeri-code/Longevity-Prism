import React, { useState } from 'react';
import { PrismExperience } from './components/PrismExperience';
import { ResultsPage } from './components/ResultsPage';

export type MotivationType = 'steady' | 'strong' | 'clear' | 'connected' | 'free' | 'growing' | 'alive' | 'balanced' | 'secure' | 'light';
export type RhythmType = 'discipline' | 'consistency' | 'momentum' | 'intention' | 'curiosity' | 'adaptability' | 'persistence' | 'structure' | 'intuition' | 'collaboration';
export type FrictionType = 'overload' | 'distraction' | 'doubt' | 'tension' | 'delay' | 'fog' | 'disorder' | 'depletion' | 'resistance' | 'weight';

export interface FusionAnswers {
  motivation?: MotivationType;
  rhythm?: RhythmType;
  friction?: FrictionType;
}

function App() {
  const [view, setView] = useState<'prism' | 'results'>('prism');
  const [answers, setAnswers] = useState<FusionAnswers>({});

  const handleComplete = (completedAnswers: FusionAnswers) => {
    setAnswers(completedAnswers);
    setView('results');
  };

  const handleReset = () => {
    setAnswers({});
    setView('prism');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100">
      {view === 'prism' ? (
        <PrismExperience onComplete={handleComplete} />
      ) : (
        <ResultsPage answers={answers} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;