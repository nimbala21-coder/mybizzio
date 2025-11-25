import React, { useEffect, useState } from 'react';

const Processing: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing your voice...",
    "Identifying intent...",
    "Drafting creative copy...",
    "Finding perfect images..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500); // Change text every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-900 text-white p-6 text-center">
      <div className="relative w-32 h-32 mb-10">
        <div className="absolute inset-0 border-t-4 border-brand-orange border-solid rounded-full animate-spin"></div>
        <div className="absolute inset-3 border-r-4 border-brand-purple border-solid rounded-full animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-4xl animate-pulse">
          AI
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4 animate-slide-up key-{step}">
        {steps[step]}
      </h2>
      <p className="text-slate-400 text-sm max-w-xs mx-auto">
        Bizzio is crafting unique templates tailored for your business.
      </p>
    </div>
  );
};

export default Processing;