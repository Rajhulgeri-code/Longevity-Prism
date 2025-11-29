import React, { useState, useRef, useEffect } from 'react';
import { QuestionFace } from './QuestionFace';
import { FusionCanvas } from './FusionCanvas';
import type { MotivationType, RhythmType, FrictionType, FusionAnswers } from '../App';

interface PrismExperienceProps {
  onComplete: (answers: FusionAnswers) => void;
}

const motivationOptions: MotivationType[] = [
  'steady', 'strong', 'clear', 'connected', 'free', 
  'growing', 'alive', 'balanced', 'secure', 'light'
];

const rhythmOptions: RhythmType[] = [
  'discipline', 'consistency', 'momentum', 'intention', 'curiosity',
  'adaptability', 'persistence', 'structure', 'intuition', 'collaboration'
];

const frictionOptions: FrictionType[] = [
  'overload', 'distraction', 'doubt', 'tension', 'delay',
  'fog', 'disorder', 'depletion', 'resistance', 'weight'
];

export const PrismExperience: React.FC<PrismExperienceProps> = ({ onComplete }) => {
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [answers, setAnswers] = useState<FusionAnswers>({});
  const [showRevealButton, setShowRevealButton] = useState(false);
  const prismRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const allAnswered = answers.motivation && answers.rhythm && answers.friction;

  useEffect(() => {
    if (allAnswered) {
      setTimeout(() => setShowRevealButton(true), 800);
    }
  }, [allAnswered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;
    
    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => prev - deltaY * 0.5);
    
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.touches[0].clientX - lastPosition.current.x;
    const deltaY = e.touches[0].clientY - lastPosition.current.y;
    
    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => prev - deltaY * 0.5);
    
    lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleReveal = () => {
    onComplete(answers);
  };

  const navigateToFace = (face: 'motivation' | 'rhythm' | 'friction' | 'top') => {
    switch (face) {
      case 'motivation':
        setRotationX(0);
        setRotationY(0);
        break;
      case 'rhythm':
        setRotationX(0);
        setRotationY(-120);
        break;
      case 'friction':
        setRotationX(0);
        setRotationY(-240);
        break;
      case 'top':
        setRotationX(90);
        setRotationY(0);
        break;
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 left-0 right-0 text-center z-10 px-4">
        <h1 className="text-neutral-800 mb-2">Your Personal Fusion</h1>
        <p className="text-neutral-600 max-w-lg mx-auto">
          Each choice pours into your prism like liquid color. Watch your unique identity take shape.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          {[answers.motivation, answers.rhythm, answers.friction].map((answer, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                answer ? 'bg-gradient-to-br from-rose-400 to-orange-400 scale-110 shadow-lg' : 'bg-neutral-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="absolute top-32 left-0 right-0 flex justify-center gap-2 z-10 px-4 flex-wrap">
        <button
          onClick={() => navigateToFace('motivation')}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            answers.motivation
              ? 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-white shadow-md'
              : 'bg-white/90 backdrop-blur text-neutral-600 hover:bg-white hover:shadow-sm'
          }`}
        >
          Motivation {answers.motivation && '✓'}
        </button>
        <button
          onClick={() => navigateToFace('rhythm')}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            answers.rhythm
              ? 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-white shadow-md'
              : 'bg-white/90 backdrop-blur text-neutral-600 hover:bg-white hover:shadow-sm'
          }`}
        >
          Rhythm {answers.rhythm && '✓'}
        </button>
        <button
          onClick={() => navigateToFace('friction')}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            answers.friction
              ? 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-white shadow-md'
              : 'bg-white/90 backdrop-blur text-neutral-600 hover:bg-white hover:shadow-sm'
          }`}
        >
          Friction {answers.friction && '✓'}
        </button>
        <button
          onClick={() => navigateToFace('top')}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            allAnswered
              ? 'bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 text-white shadow-lg animate-pulse'
              : 'bg-white/90 backdrop-blur text-neutral-400'
          }`}
          disabled={!allAnswered}
        >
          Fusion {allAnswered && '✓'}
        </button>
      </div>

      {/* 3D Prism Container */}
      <div
        className={`relative w-full max-w-2xl h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-all duration-700 ${
          allAnswered ? 'filter drop-shadow-2xl' : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: '1200px' }}
      >
        <div
          ref={prismRef}
          className="relative transition-transform duration-700 ease-out"
          style={{
            width: '400px',
            height: '400px',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`
          }}
        >
          {/* Face 1 - Motivation (Front, 0 degrees) */}
          <div
            className="absolute w-full h-full"
            style={{
              transform: 'rotateY(0deg) translateZ(230px)'
            }}
          >
            <QuestionFace
              question="What motivates you toward a meaningful life?"
              options={motivationOptions}
              selectedOption={answers.motivation}
              onSelect={(option) => setAnswers(prev => ({ ...prev, motivation: option as MotivationType }))}
            />
          </div>

          {/* Face 2 - Rhythm (120 degrees) */}
          <div
            className="absolute w-full h-full"
            style={{
              transform: 'rotateY(120deg) translateZ(230px)'
            }}
          >
            <QuestionFace
              question="What rhythm do you naturally move with?"
              options={rhythmOptions}
              selectedOption={answers.rhythm}
              onSelect={(option) => setAnswers(prev => ({ ...prev, rhythm: option as RhythmType }))}
            />
          </div>

          {/* Face 3 - Friction (240 degrees) */}
          <div
            className="absolute w-full h-full"
            style={{
              transform: 'rotateY(240deg) translateZ(230px)'
            }}
          >
            <QuestionFace
              question="What form does friction take for you?"
              options={frictionOptions}
              selectedOption={answers.friction}
              onSelect={(option) => setAnswers(prev => ({ ...prev, friction: option as FrictionType }))}
            />
          </div>

          {/* Top Face - Liquid Fusion Canvas (Triangular) */}
          <div
            className={`absolute transition-all duration-700 ${
              allAnswered ? 'animate-pulse' : ''
            }`}
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-280px',
              marginTop: '-242.5px',
              transform: 'rotateX(90deg) translateZ(200px)',
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d'
            }}
          >
            <FusionCanvas answers={answers} />
          </div>

          {/* Bottom Face - Glass Base (Triangular) */}
          <div
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-280px',
              marginTop: '-242.5px',
              width: '0',
              height: '0',
              borderLeft: '280px solid transparent',
              borderRight: '280px solid transparent',
              borderTop: '485px solid rgba(255, 255, 255, 0.95)',
              transform: 'rotateX(-90deg) translateZ(200px)',
              transformOrigin: 'center center',
              filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.12))',
              backdropFilter: 'blur(10px)'
            }}
          />
        </div>
      </div>

      {/* Reveal Button */}
      {showRevealButton && (
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10 px-4 animate-fade-in">
          <button
            onClick={handleReveal}
            className="px-10 py-5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-pulse"
          >
            Reveal My Fusion
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-neutral-500 text-sm px-4">
        Drag to rotate • Watch liquid colors fill your prism
      </div>
    </div>
  );
};