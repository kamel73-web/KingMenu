import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Play, Pause, RotateCcw,
  ChevronLeft, ChevronRight, Volume2, VolumeX,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dish } from '../../types';

interface CookModeModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
}

export default function CookModeModal({ dish, isOpen, onClose }: CookModeModalProps) {
  const { t, i18n } = useTranslation(['cookMode', 'translation']);
  const tc = (key: string, opts?: Record<string, unknown>) =>
    t(`cookMode.${key}`, { ns: 'cookMode', ...opts });

  const [currentStep, setCurrentStep]         = useState(0);
  const [timer, setTimer]                     = useState(0);
  const [isTimerRunning, setIsTimerRunning]   = useState(false);
  const [completedSteps, setCompletedSteps]   = useState<Set<number>>(new Set());
  const [voiceEnabled, setVoiceEnabled]       = useState(false);
  const [voices, setVoices]                   = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice]     = useState<string>('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  /* ── Timer ── */
  useEffect(() => {
    if (!isTimerRunning) return;
    const id = setInterval(() => setTimer(p => p + 1), 1000);
    return () => clearInterval(id);
  }, [isTimerRunning]);

  /* ── Load voices ── */
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      const v = speechSynthesis.getVoices();
      setVoices(v);
      const lang = i18n.language.split('-')[0];
      const match = v.find(x => x.lang.startsWith(lang));
      if (match) setSelectedVoice(match.voiceURI);
    };
    load();
    speechSynthesis.addEventListener('voiceschanged', load);
    return () => speechSynthesis.removeEventListener('voiceschanged', load);
  }, [i18n.language]);

  /* ── Speak current step ── */
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.85;
    const lang = i18n.language.split('-')[0];
    const langMap: Record<string,string> = { en:'en-US', fr:'fr-FR', ar:'ar-SA', es:'es-ES', it:'it-IT' };
    utt.lang = langMap[lang] || lang;
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) utt.voice = voice;
    else {
          const fallback = voices.find(v => v.lang.startsWith(lang));
      if (fallback) utt.voice = fallback;
    }
    utteranceRef.current = utt;
    speechSynthesis.speak(utt);
  }, [voices, selectedVoice, i18n.language]);

  useEffect(() => {
    if (!isOpen) { speechSynthesis.cancel?.(); return; }
    if (voiceEnabled && dish.instructions[currentStep]) {
      speak(String(dish.instructions[currentStep]));
    }
  }, [currentStep, voiceEnabled, isOpen, speak, dish.instructions]);

  /* ── Reset on open ── */
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setTimer(0);
      setIsTimerRunning(false);
      setCompletedSteps(new Set());
    } else {
      speechSynthesis.cancel?.();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const instructions = dish.instructions ?? [];
  const total        = instructions.length;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleStepComplete = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    if (currentStep < total - 1) setCurrentStep(p => p + 1);
  };

  const go = (delta: number) => {
    const next = Math.max(0, Math.min(total - 1, currentStep + delta));
    setCurrentStep(next);
  };

  const progress = total > 0 ? Math.round(((currentStep + 1) / total) * 100) : 0;

  const toggleVoice = () => {
    if (voiceEnabled) {
      speechSynthesis.cancel();
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
      if (instructions[currentStep]) speak(String(instructions[currentStep]));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col">

      {/* ── Header ── */}
      <div className="bg-gray-900 border-b border-gray-800 text-white px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all flex-shrink-0"
            aria-label={t('common.close', { ns: 'translation' })}
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white truncate">{dish.title}</h2>
            <p className="text-xs text-gray-400">{tc('title')}</p>
          </div>
        </div>

        {/* Timer + Voice */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsTimerRunning(p => !p)}
            className="p-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg transition-all"
          >
            {isTimerRunning
              ? <Pause className="h-4 w-4 text-white" />
              : <Play  className="h-4 w-4 text-white" />}
          </button>
          <span className="font-mono text-sm text-white tabular-nums w-14 text-center">
            {formatTime(timer)}
          </span>
          <button
            onClick={() => { setTimer(0); setIsTimerRunning(false); }}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-all"
          >
            <RotateCcw className="h-4 w-4 text-gray-400" />
          </button>

          <div className="w-px h-6 bg-gray-700 mx-1" />

          <button
            onClick={toggleVoice}
            title={voiceEnabled ? tc('mute') : tc('unmute')}
            className={`p-1.5 rounded-lg transition-all ${
              voiceEnabled ? 'bg-violet-600 text-white' : 'hover:bg-gray-800 text-gray-400'
            }`}
          >
            {voiceEnabled
              ? <Volume2  className="h-4 w-4" />
              : <VolumeX  className="h-4 w-4" />}
          </button>

          {/* Voice selector (only when enabled and voices available) */}
          {voiceEnabled && voices.length > 0 && (
            <select
              value={selectedVoice}
              onChange={e => setSelectedVoice(e.target.value)}
              className="text-xs bg-gray-800 text-gray-200 border border-gray-700 rounded px-1 py-1 max-w-[120px]"
            >
              {voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name.length > 16 ? v.name.slice(0, 16) + '…' : v.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="bg-gray-900 px-4 pt-3 pb-3 border-b border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="font-medium text-gray-200">
            {tc('stepCount', { current: currentStep + 1, total })}
          </span>
          <span>{tc('percentComplete', { percent: progress })}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-violet-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar ingredients (lg+) */}
        <div className="hidden lg:flex flex-col w-72 xl:w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              {tc('ingredients')}
            </h3>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {dish.ingredients.map((ing, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2.5 bg-gray-800 rounded-xl border border-gray-700"
              >
                <span className="text-sm text-gray-200 font-medium">{ing.name}</span>
                <span className="text-sm text-violet-400 font-semibold ml-3 flex-shrink-0">
                  {ing.amount} {ing.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 sm:px-8 py-6">
            <div className="w-full max-w-2xl">

              {/* Step badge */}
              <div className="flex justify-center mb-6">
                <span className="px-4 py-1.5 bg-violet-600 text-white text-sm font-semibold rounded-full">
                  {t('recipe.step', { ns: 'translation' })} {currentStep + 1}
                </span>
              </div>

              {/* Instruction text */}
              <p className="text-lg sm:text-xl lg:text-2xl text-white leading-relaxed text-center font-medium">
                {String(instructions[currentStep] ?? '')}
              </p>

              {/* Completed badge */}
              {completedSteps.has(currentStep) && (
                <div className="mt-6 p-4 bg-green-900/60 border border-green-700 rounded-xl text-center">
                  <p className="text-green-300 font-medium">{tc('stepCompletedBadge')}</p>
                </div>
              )}

              {/* Mobile ingredients */}
              <div className="lg:hidden mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {tc('ingredientsStep')}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {dish.ingredients.slice(0, 4).map((ing, i) => (
                    <div key={i} className="p-2.5 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="text-xs font-medium text-gray-200 truncate">{ing.name}</div>
                      <div className="text-xs text-violet-400 font-semibold mt-0.5">
                        {ing.amount} {ing.unit}
                      </div>
                    </div>
                  ))}
                </div>
                {dish.ingredients.length > 4 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {tc('moreIngredients', { count: dish.ingredients.length - 4 })}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* ── Navigation controls ── */}
          <div className="bg-gray-900 border-t border-gray-800 px-4 py-4">
            <div className="max-w-2xl mx-auto">

              {/* Mobile */}
              <div className="flex sm:hidden items-center justify-center gap-4">
                <button
                  onClick={() => go(-1)}
                  disabled={currentStep === 0}
                  className="w-12 h-12 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={handleStepComplete}
                  className="w-16 h-16 bg-violet-600 hover:bg-violet-500 text-white rounded-full transition-all shadow-lg flex items-center justify-center text-lg font-bold"
                >
                  {currentStep === total - 1 ? '✓' : currentStep + 2}
                </button>

                <button
                  onClick={() => go(1)}
                  disabled={currentStep === total - 1}
                  className="w-12 h-12 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Desktop */}
              <div className="hidden sm:flex items-center justify-center gap-4">
                <button
                  onClick={() => go(-1)}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-200 rounded-xl hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                >
                  <ChevronLeft className="h-5 w-5" />
                  {t('recipeDetails.previous', { ns: 'translation' })}
                </button>

                <button
                  onClick={handleStepComplete}
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all font-semibold shadow-md"
                >
                  {currentStep === total - 1
                    ? t('recipeDetails.finishCooking',  { ns: 'translation' })
                    : t('recipeDetails.completeStep',   { ns: 'translation' })}
                </button>

                <button
                  onClick={() => go(1)}
                  disabled={currentStep === total - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-200 rounded-xl hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                >
                  {t('recipeDetails.next', { ns: 'translation' })}
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
