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
  const currentStepObj = steps.find(s => s.id === currentStep) || steps[0];
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <nav aria-label="Progress" className="mb-6 sm:mb-8">
      {/* ── Mobile View (< sm): Sleek Progress Bar with Step Pills ── */}
      <div className="block sm:hidden bg-warm-50 p-4 rounded-lg border border-warm-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 font-body">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-xs font-medium text-warm-700 font-heading text-right">
            {currentStepObj.name}
          </span>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-warm-200 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%`, backgroundColor: '#542A3A' }}
          />
        </div>

        {/* Mini Step Pills for Direct Jump */}
        <div className="flex justify-between items-center pt-1">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id || highestStepReached > step.id;
            const isCurrent = currentStep === step.id;
            const isClickable = highestStepReached >= step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                aria-label={`Jump to step ${step.id}: ${step.name}`}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  isCurrent
                    ? 'ring-2 ring-offset-1 ring-brand-700 text-white font-bold'
                    : isCompleted
                    ? 'bg-brand-600 text-white hover:opacity-90'
                    : 'bg-warm-200 text-warm-500 cursor-not-allowed'
                }`}
                style={isCurrent ? { backgroundColor: '#542A3A' } : {}}
              >
                {isCompleted ? <FiCheck className="w-3.5 h-3.5" /> : step.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop View (>= sm): Full Stepper with Labels ── */}
      <div className="hidden sm:block overflow-x-auto pb-4">
        <ol role="list" className="flex items-center justify-between min-w-[540px] px-4">
          {steps.map((step, stepIdx) => {
            const isCompleted = currentStep > step.id || highestStepReached > step.id;
            const isCurrent = currentStep === step.id;
            const isClickable = highestStepReached >= step.id;
            
            return (
              <li key={step.name} className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-4' : ''}`}>
                {/* Line connector */}
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute top-4 left-0 -ml-px mt-0.5 w-full h-0.5 bg-warm-200" aria-hidden="true" />
                )}
                {stepIdx !== steps.length - 1 && isCompleted && (
                  <div className="absolute top-4 left-0 -ml-px mt-0.5 w-full h-0.5 bg-brand-600 transition-all duration-500 ease-in-out" aria-hidden="true" />
                )}

                <div className="relative flex flex-col items-center">
                  <button
                    type="button"
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
                  <span className={`mt-2 text-center text-xs font-medium whitespace-nowrap ${
                      isCurrent ? 'text-brand-700 font-semibold' : isCompleted ? 'text-warm-900' : 'text-warm-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default WizardStepper;
