import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { buildTreeFromArray, generateAlgorithmSteps } from '../utils/treeUtils';

export function useAlgorithm(initialData: (number | null)[]) {
  const [data, setData] = useState<(number | null)[]>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const timerRef = useRef<number | null>(null);
  const prevDataRef = useRef<(number | null)[]>(initialData);

  // 使用useMemo计算树和步骤
  const { root, steps } = useMemo(() => {
    const tree = buildTreeFromArray(data);
    const newSteps = generateAlgorithmSteps(tree);
    return { root: tree, steps: newSteps };
  }, [data]);

  // 自动播放逻辑
  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentStep >= steps.length - 1) {
      // 使用setTimeout来避免同步setState
      const timeoutId = window.setTimeout(() => {
        setIsPlaying(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    timerRef.current = window.setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, speed);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleDataChange = useCallback((newData: (number | null)[]) => {
    // 检查数据是否真的变化了
    const prevData = prevDataRef.current;
    const isChanged = newData.length !== prevData.length || 
      newData.some((v, i) => v !== prevData[i]);
    
    if (isChanged) {
      prevDataRef.current = newData;
      setData(newData);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, []);

  const handlePrevious = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const handlePlayPause = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [currentStep, steps.length]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const handleStepChange = useCallback((step: number) => {
    setIsPlaying(false);
    setCurrentStep(step);
  }, []);

  return {
    root,
    steps,
    currentStep,
    isPlaying,
    speed,
    currentStepData: steps[currentStep] || null,
    handleDataChange,
    handlePrevious,
    handleNext,
    handlePlayPause,
    handleSpeedChange,
    handleStepChange
  };
}
