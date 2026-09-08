import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../components/wizard/WizardStepper';
import StepProductInfo from '../../components/wizard/StepProductInfo';
import StepImageUpload from '../../components/wizard/StepImageUpload';
import StepAIImageProcessing from '../../components/wizard/StepAIImageProcessing';
import StepAIContent from '../../components/wizard/StepAIContent';
import StepReview from '../../components/wizard/StepReview';
import StepPublish from '../../components/wizard/StepPublish';

const AddProductPage = () => {
  const navigate = useNavigate();
  
  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStepReached, setHighestStepReached] = useState(1);
  
  // Product Data
  const [productData, setProductData] = useState(null); // Will hold the DB product object once created in Step 1

  const handleNextStep = (dataUpdate = {}) => {
    // Merge updates into our product state if provided
    if (Object.keys(dataUpdate).length > 0) {
      setProductData(prev => ({ ...prev, ...dataUpdate }));
    }
    
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > highestStepReached) {
      setHighestStepReached(next);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleJumpToStep = (stepId) => {
    if (stepId <= highestStepReached) {
      setCurrentStep(stepId);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepProductInfo 
          productData={productData} 
          setProductData={setProductData} 
          onNext={handleNextStep} 
        />;
      case 2:
        return <StepImageUpload 
          productData={productData}
          setProductData={setProductData}
          onNext={handleNextStep}
          onBack={handlePrevStep} 
        />;
      case 3:
        return <StepAIImageProcessing 
          productData={productData}
          setProductData={setProductData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />;
      case 4:
        return <StepAIContent 
          productData={productData}
          setProductData={setProductData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />;
      case 5:
        return <StepReview 
          productData={productData}
          setProductData={setProductData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
          onEditStep={handleJumpToStep}
        />;
      case 6:
        return <StepPublish 
          productData={productData}
        />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-8 sm:pb-12">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-warm-900 font-heading">Add New Product</h1>
        <p className="text-sm text-warm-600 mt-1 sm:mt-2">Create and enhance a new product using our AI-powered wizard.</p>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-warm-200 p-4 sm:p-6 md:p-8">
        <WizardStepper 
          currentStep={currentStep} 
          onStepClick={handleJumpToStep}
          highestStepReached={highestStepReached}
        />
        
        <div className="mt-4 sm:mt-8 min-h-[320px] sm:min-h-[400px]">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
