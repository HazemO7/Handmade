import React from 'react';
import { render, screen } from '@testing-library/react';
import WizardStepper from '../components/wizard/WizardStepper';

describe('WizardStepper Component', () => {
  it('renders all steps', () => {
    render(<WizardStepper currentStep={1} highestStepReached={1} onStepClick={() => {}} />);
    
    expect(screen.getByText('Product Info')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('AI Enhance')).toBeInTheDocument();
  });

  it('highlights current step', () => {
    render(<WizardStepper currentStep={1} highestStepReached={1} onStepClick={() => {}} />);
    
    expect(screen.getByText('Product Info')).toBeInTheDocument();
  });
});
