import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Dish } from '../../types';

interface CookModeModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
}

export default function CookModeModal({ dish, isOpen, onClose }: CookModeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(dish.instructions[currentStep]);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, [currentStep, voiceEnabled, dish.instructions]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStepComplete = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    
    if (currentStep < dish.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < dish.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progress = ((currentStep + 1) / dish.instructions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <X className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-heading font-bold">{dish.title}</h2>
            <p className="text-xs sm:text-sm text-gray-300">Cook Mode</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Timer */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 sm:p-2 bg-primary hover:bg-primary-dark rounded-lg transition-all"
            >
              {isTimerRunning ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
            <span className="font-mono text-sm sm:text-lg">{formatTime(timer)}</span>
            <button
              onClick={() => {
                setTimer(0);
                setIsTimerRunning(false);
              }}
              className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-all"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Voice Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-1.5 sm:p-2 rounded-lg transition-all ${
              voiceEnabled ? 'bg-accent text-white' : 'hover:bg-gray-800'
            }`}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between text-white text-xs sm:text-sm mb-2">
          <span>Step {currentStep + 1} of {dish.instructions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Ingredients Sidebar */}
        <div className="hidden lg:block w-80 bg-gray-100 p-6 overflow-y-auto">
          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
            Ingredients
          </h3>
          <div className="space-y-3">
            {dish.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <span className="font-body font-medium text-gray-900">
                    {ingredient.name}
                  </span>
                  <span className="text-primary font-body font-semibold">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="max-w-2xl text-center w-full">
              <div className="mb-8">
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-full text-xs sm:text-sm font-body font-medium mb-4">
                  Step {currentStep + 1}
                </span>
                <p className="text-lg sm:text-xl lg:text-2xl font-body text-gray-800 leading-relaxed px-4">
                  {String(dish.instructions[currentStep])}
                </p>
              </div>

              {/* Mobile Ingredients Panel */}
              <div className="lg:hidden mb-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="text-sm font-heading font-semibold text-gray-900 mb-3">
                  Ingredients for this step
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {dish.ingredients.slice(0, 4).map((ingredient, index) => (
                    <div
                      key={index}
                      className="p-2 bg-white rounded border border-gray-200"
                    >
                      <div className="font-medium text-gray-900 truncate">
                        {ingredient.name}
                      </div>
                      <div className="text-primary font-semibold">
                        {ingredient.amount} {ingredient.unit}
                      </div>
                    </div>
                  ))}
                </div>
                {dish.ingredients.length > 4 && (
                  <p className="text-xs text-gray-500 mt-2">
                    +{dish.ingredients.length - 4} more ingredients
                  </p>
                )}
              </div>

              {completedSteps.has(currentStep) && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-800 font-body text-sm sm:text-base">✓ Step completed!</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="bg-white border-t border-gray-200 p-3 sm:p-6">
            <div className="flex flex-col items-center justify-center max-w-2xl mx-auto space-y-3">
              {/* Mobile: Stack buttons vertically */}
              <div className="flex sm:hidden w-full justify-center space-x-4 px-4">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="w-12 h-12 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <button
                  onClick={handleStepComplete}
                  className="w-16 h-16 bg-primary text-white rounded-full hover:bg-primary-dark transition-all font-body font-bold text-lg flex items-center justify-center shadow-lg"
                >
                  {currentStep === dish.instructions.length - 1 ? '✓' : currentStep + 1}
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={currentStep === dish.instructions.length - 1}
                  className="w-12 h-12 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              
              {/* Desktop: Show buttons horizontally */}
              <div className="hidden sm:flex items-center justify-center space-x-6">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="font-body font-medium">Previous</span>
                </button>
                
                <button
                  onClick={handleStepComplete}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-body font-medium"
                >
                  {currentStep === dish.instructions.length - 1 ? 'Finish Cooking' : 'Complete Step'}
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={currentStep === dish.instructions.length - 1}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-body font-medium">Next</span>
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
