import React, { useState, useCallback } from 'react';
import { EXAMPLE_DATA } from '../../utils/examples';
import { parseInput, generateRandomTree } from '../../utils/treeUtils';
import './DataInput.css';

interface DataInputProps {
  onDataChange: (data: (number | null)[]) => void;
}

const DataInput: React.FC<DataInputProps> = ({ onDataChange }) => {
  const [inputValue, setInputValue] = useState('[3,9,20,null,null,15,7]');
  const [error, setError] = useState('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const result = parseInput(value);
    if (result.isValid) {
      setError('');
      onDataChange(result.data);
    } else {
      setError(result.errorMessage);
    }
  }, [onDataChange]);

  const handleExampleClick = useCallback((data: string) => {
    setInputValue(data);
    const result = parseInput(data);
    if (result.isValid) {
      setError('');
      onDataChange(result.data);
    }
  }, [onDataChange]);

  const handleRandomGenerate = useCallback(() => {
    const randomData = generateRandomTree(7);
    const dataStr = `[${randomData.map(v => v === null ? 'null' : v).join(',')}]`;
    setInputValue(dataStr);
    setError('');
    onDataChange(randomData);
  }, [onDataChange]);

  return (
    <div className="data-input-container">
      <div className="input-row">
        <label className="input-label">输入数据:</label>
        <input
          type="text"
          className={`data-input ${error ? 'input-error' : ''}`}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="例如: [3,9,20,null,null,15,7]"
        />
        <button className="random-btn" onClick={handleRandomGenerate} title="随机生成">
          🎲 随机
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="examples-row">
        <span className="examples-label">示例:</span>
        {EXAMPLE_DATA.map((example, index) => (
          <button
            key={index}
            className="example-btn"
            onClick={() => handleExampleClick(example.data)}
            title={`预期结果: ${example.expected}`}
          >
            {example.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataInput;
