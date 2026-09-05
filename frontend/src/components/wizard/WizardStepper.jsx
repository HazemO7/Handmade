import React from 'react';
import { FiCheck } from 'react-icons/fi';

const steps = [
  { id: 1, name: 'Product Info' },
  { id: 2, name: 'Images' },
  { id: 3, name: 'AI Enhance' },
  { id: 4, name: 'AI Content' },
  { id: 5, name: 'Review' },
  { id: 6, name: 'Publish' },
];

const WizardStepper = ({ currentStep, onStepClick, highestStepReached }) => {
  return (
    <nav aria-label="Progress" className="mb-8 overflow-x-auto pb-4">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => {
          const isCompleted = currentStep > step.id || highestStepReached > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = highestStepReached >= step.id;
          
          return (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              {/* Line connector */}
              {stepIdx !== steps.length - 1 && (
                <div className="absolute top-4 left-0 -ml-px mt-0.5 w-full h-0.5 bg-warm-200" aria-hidden="true" />
              )}
              {stepIdx !== steps.length - 1 && isCompleted && (
                <div className="absolute top-4 left-0 -ml-px mt-0.5 w-full h-0.5 bg-brand-600 transition-all duration-500 ease-in-out" aria-hidden="true" />
              )}

              <div className="relative flex items-center justify-center">
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`group relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white outline-none transition-colors ${
                    isCompleted
                      ? 'border-brand-600 hover:bg-brand-50 cursor-pointer'
                      : isCurrent
                      ? 'border-brand-600 ring-2 ring-brand-100 cursor-default'
                      : 'border-warm-300 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <FiCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-brand-600' : 'text-warm-500'
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </button>
                <span className={`absolute -bottom-6 w-24 text-center text-xs font-medium ${
                    isCurrent ? 'text-brand-700' : isCompleted ? 'text-warm-900' : 'text-warm-500'
                  }`}
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                >
                  {step.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default WizardStepper;
