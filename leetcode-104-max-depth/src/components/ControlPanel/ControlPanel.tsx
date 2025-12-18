import React, { useEffect, useCallback } from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onStepChange: (step: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPrevious,
  onNext,
  onPlayPause,
  onSpeedChange,
  onStepChange
}) => {
  // 键盘快捷键
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        onPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onNext();
        break;
      case ' ':
        e.preventDefault();
        onPlayPause();
        break;
    }
  }, [onPrevious, onNext, onPlayPause]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="control-panel">
      <div className="controls-row">
        <div className="control-buttons">
          <button 
            className="control-btn" 
            onClick={onPrevious}
            disabled={currentStep === 0}
            title="上一步 (←)"
          >
            <span className="btn-icon">⏮</span>
            <span className="btn-text">上一步</span>
            <span className="shortcut">←</span>
          </button>
          
          <button 
            className="control-btn play-btn" 
            onClick={onPlayPause}
            title={isPlaying ? '暂停 (空格)' : '播放 (空格)'}
          >
            <span className="btn-icon">{isPlaying ? '⏸' : '▶'}</span>
            <span className="btn-text">{isPlaying ? '暂停' : '播放'}</span>
            <span className="shortcut">空格</span>
          </button>
          
          <button 
            className="control-btn" 
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            title="下一步 (→)"
          >
            <span className="btn-icon">⏭</span>
            <span className="btn-text">下一步</span>
            <span className="shortcut">→</span>
          </button>
        </div>

        <div className="speed-control">
          <label className="speed-label">速度:</label>
          <select 
            className="speed-select"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          >
            <option value={2000}>0.5x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={250}>4x</option>
          </select>
        </div>

        <div className="step-counter">
          步骤: {currentStep + 1} / {totalSteps}
        </div>
      </div>

      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          className="progress-slider"
          min={0}
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
