import React, { useState, useEffect } from 'react';
import type { FusionAnswers, MotivationType, RhythmType, FrictionType } from '../App';
import { Layers, Zap, AlertCircle, Sparkles } from 'lucide-react';

interface ResultsPageProps {
  answers: FusionAnswers;
  onReset: () => void;
}

// Motivation interpretations
const motivationMeanings: Record<MotivationType, { title: string; description: string }> = {
  steady: {
    title: 'Steady Foundation',
    description: 'You value stability and reliability. Your version of longevity is built on consistent, dependable rhythms—a life that feels grounded and sustainable, where balance emerges from predictable foundations.'
  },
  strong: {
    title: 'Resilient Core',
    description: 'You seek durability and capability. Longevity means building physical and mental strength that withstands challenges—a life anchored in power, endurance, and the confidence to handle what comes.'
  },
  clear: {
    title: 'Mental Clarity',
    description: 'You prioritize clear thinking and sharp awareness. A long, meaningful life is one where your mind stays focused, uncluttered, and present—clarity as the compass for all decisions.'
  },
  connected: {
    title: 'Deep Belonging',
    description: 'You value relationships and community. Longevity is about sustained connection—bonds that deepen over time, a life rich with shared experiences and mutual support.'
  },
  free: {
    title: 'Autonomy & Choice',
    description: 'You cherish independence and self-direction. A sustainable life means maintaining freedom—the ability to move, choose, and live on your own terms without restriction.'
  },
  growing: {
    title: 'Continuous Evolution',
    description: 'You see longevity as ongoing development. A meaningful life is one of perpetual learning, expansion, and transformation—never stagnant, always becoming.'
  },
  alive: {
    title: 'Vibrant Energy',
    description: 'You want to feel fully alive. Longevity means vitality—a body and mind that feels energized, engaged, and passionately present in each moment.'
  },
  balanced: {
    title: 'Harmonious Integration',
    description: 'You seek equilibrium across all areas. A sustainable life is one where work, rest, movement, and stillness coexist in harmony—nothing excessive, nothing neglected.'
  },
  secure: {
    title: 'Safety & Stability',
    description: 'You value certainty and protection. Longevity means building a life where you feel safe, supported, and insulated from unnecessary risk or volatility.'
  },
  light: {
    title: 'Effortless Ease',
    description: 'You prioritize simplicity and lightness. A long, meaningful life feels easy, unburdened—movement, thinking, and living without heaviness or struggle.'
  }
};

// Rhythm interpretations
const rhythmMeanings: Record<RhythmType, { title: string; description: string }> = {
  discipline: {
    title: 'Structured Action',
    description: 'You move through life with intentional structure. Your natural rhythm is methodical and controlled—you set rules, follow systems, and trust in consistent effort over time.'
  },
  consistency: {
    title: 'Reliable Rhythm',
    description: 'You thrive on repetition and routine. Action for you is steady, predictable, and dependable—small steps repeated daily, building momentum through unwavering commitment.'
  },
  momentum: {
    title: 'Forward Drive',
    description: 'You build energy as you move. Your action style is dynamic and cumulative—once you start, you gain speed, using previous wins to fuel the next step forward.'
  },
  intention: {
    title: 'Purposeful Movement',
    description: 'You act with clarity of purpose. Every choice is deliberate, aligned with deeper values—you don\'t move randomly; you move meaningfully, guided by internal direction.'
  },
  curiosity: {
    title: 'Exploratory Action',
    description: 'You approach life with open inquiry. Your action style is experimental and inquisitive—you try, test, and explore, driven by the desire to discover and understand.'
  },
  adaptability: {
    title: 'Fluid Response',
    description: 'You adjust to changing conditions. Your action identity is flexible and responsive—you pivot when needed, flowing with circumstances rather than resisting them.'
  },
  persistence: {
    title: 'Enduring Effort',
    description: 'You keep moving through obstacles. Your action style is resilient and tenacious—challenges don\'t stop you; they deepen your resolve to continue.'
  },
  structure: {
    title: 'Organized Framework',
    description: 'You create systems to guide your movement. Action for you is planned, organized, and sequential—you prefer clear frameworks and logical progressions.'
  },
  intuition: {
    title: 'Instinctive Flow',
    description: 'You trust your inner sense. Your action style is organic and felt—you move based on what feels right in the moment, guided by internal signals rather than external rules.'
  },
  collaboration: {
    title: 'Shared Movement',
    description: 'You act in connection with others. Your natural rhythm involves partnership, teamwork, and collective effort—you gain energy and direction from shared action.'
  }
};

// Friction interpretations
const frictionMeanings: Record<FrictionType, { title: string; description: string }> = {
  overload: {
    title: 'System Overwhelm',
    description: 'When friction appears, it shows up as too much—too many inputs, demands, or stimuli. Your system tightens when capacity is exceeded, signaling the need to reduce, simplify, or create space.'
  },
  distraction: {
    title: 'Scattered Focus',
    description: 'Stress manifests as fragmented attention. When friction enters, your mind becomes pulled in multiple directions, making it difficult to stay present or complete what matters most.'
  },
  doubt: {
    title: 'Internal Uncertainty',
    description: 'Friction shows up as questioning and hesitation. When stress builds, you lose confidence in your choices, second-guessing decisions and losing trust in your direction.'
  },
  tension: {
    title: 'Physical Tightness',
    description: 'Stress lives in your body as constriction. When friction appears, you feel it physically—tight shoulders, clenched jaw, restricted breathing—your body holding what your mind cannot release.'
  },
  delay: {
    title: 'Stalled Momentum',
    description: 'Friction manifests as procrastination or stagnation. When stress builds, forward movement slows or stops—not from lack of desire, but from an internal brake that needs addressing.'
  },
  fog: {
    title: 'Clouded Clarity',
    description: 'Stress appears as mental haziness. When friction enters, your thinking becomes unclear, muddled, or slow—like trying to see through a thick mist that obscures the path ahead.'
  },
  disorder: {
    title: 'System Chaos',
    description: 'Friction shows up as disorganization. When stress builds, structures fall apart—routines break, plans scatter, and the environment around you mirrors internal turbulence.'
  },
  depletion: {
    title: 'Energy Drain',
    description: 'Stress manifests as exhaustion. When friction appears, it saps your vitality—physical energy drops, emotional reserves empty, and everything feels harder than it should.'
  },
  resistance: {
    title: 'Internal Opposition',
    description: 'Friction shows up as pushback. When stress builds, you feel an internal "no"—a force that resists movement, change, or effort, creating struggle against yourself.'
  },
  weight: {
    title: 'Emotional Heaviness',
    description: 'Stress appears as burden. When friction enters, life feels heavy, dense, or effortful—like carrying something that weighs you down emotionally and physically.'
  }
};

export const ResultsPage: React.FC<ResultsPageProps> = ({ answers, onReset }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const motivationData = answers.motivation ? motivationMeanings[answers.motivation] : null;
  const rhythmData = answers.rhythm ? rhythmMeanings[answers.rhythm] : null;
  const frictionData = answers.friction ? frictionMeanings[answers.friction] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`max-w-4xl w-full transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full mb-4 text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-neutral-800 mb-3">Your Personal Fusion</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            A three-dimensional reflection of your inner system—what motivates you, your natural rhythm, and where friction appears.
          </p>
        </div>

        {/* Three Dimensions */}
        <div className="space-y-6 mb-8">
          {/* Motivation */}
          {motivationData && (
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                  <Layers className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-neutral-500">Motivation</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-sm text-neutral-600 capitalize">{answers.motivation}</span>
                  </div>
                  <h2 className="text-neutral-800 mb-2">{motivationData.title}</h2>
                  <p className="text-neutral-600">{motivationData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rhythm */}
          {rhythmData && (
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-neutral-500">Rhythm</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-sm text-neutral-600 capitalize">{answers.rhythm}</span>
                  </div>
                  <h2 className="text-neutral-800 mb-2">{rhythmData.title}</h2>
                  <p className="text-neutral-600">{rhythmData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Friction */}
          {frictionData && (
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-rose-100 to-orange-100 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-neutral-500">Friction</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-sm text-neutral-600 capitalize">{answers.friction}</span>
                  </div>
                  <h2 className="text-neutral-800 mb-2">{frictionData.title}</h2>
                  <p className="text-neutral-600">{frictionData.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Integration Analysis */}
        {answers.motivation && answers.rhythm && answers.friction && (
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-8 mb-8 border border-rose-200">
            <h3 className="text-neutral-800 mb-4">Integration</h3>
            <p className="text-neutral-700 leading-relaxed">
              Your unique signature combines <strong className="text-neutral-800">{motivationData?.title.toLowerCase()}</strong> with <strong className="text-neutral-800">{rhythmData?.title.toLowerCase()}</strong>, while navigating <strong className="text-neutral-800">{frictionData?.title.toLowerCase()}</strong>. This creates a distinct behavioral pattern: you seek {answers.motivation} as your north star, move through life with {answers.rhythm}, and recognize that when friction appears, it takes the form of {answers.friction}. Understanding this three-dimensional system allows you to honor your natural rhythms while addressing the specific challenges that emerge in your path.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-8 py-4 bg-white border-2 border-neutral-800 text-neutral-800 rounded-full hover:bg-neutral-800 hover:text-white transition-all"
          >
            Start Over
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full hover:shadow-xl transition-all hover:scale-105"
          >
            Save Your Fusion
          </button>
        </div>
      </div>
    </div>
  );
};
