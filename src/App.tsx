import React from 'react';
import {
  Header,
  DataInput,
  TreeVisualization,
  CodeDisplay,
  ControlPanel,
  WeChatFloat
} from './components';
import { useAlgorithm } from './hooks/useAlgorithm';
import './App.css';

const App: React.FC = () => {
  const {
    root,
    steps,
    currentStep,
    isPlaying,
    speed,
    currentStepData,
    handleDataChange,
    handlePrevious,
    handleNext,
    handlePlayPause,
    handleSpeedChange,
    handleStepChange,
    handleReset
  } = useAlgorithm([3, 9, 20, null, null, 15, 7]);

  return (
    <div className="app">
      <Header />
      <DataInput onDataChange={handleDataChange} />
      
      <main className="main-content">
        <TreeVisualization 
          root={root} 
          currentStep={currentStepData} 
        />
        <CodeDisplay currentStep={currentStepData} />
      </main>

      <ControlPanel
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={steps.length}
        speed={speed}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onPlayPause={handlePlayPause}
        onSpeedChange={handleSpeedChange}
        onStepChange={handleStepChange}
        onReset={handleReset}
      />

      <WeChatFloat />
    </div>
  );
};

export default App;
