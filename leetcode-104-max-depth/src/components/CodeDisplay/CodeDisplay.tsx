import React from 'react';
import type { AlgorithmStep, VariableState } from '../../types';
import { CODE_LINES } from '../../utils/algorithmCode';
import './CodeDisplay.css';

interface CodeDisplayProps {
  currentStep: AlgorithmStep | null;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ currentStep }) => {
  const highlightLine = currentStep?.highlightLine ?? -1;
  const variables = currentStep?.variables ?? [];

  const getVariableForLine = (lineIndex: number): VariableState | undefined => {
    return variables.find(v => v.line === lineIndex);
  };

  return (
    <div className="code-display">
      <div className="code-header">
        <span className="code-title">Java 代码</span>
        <span className="code-badge">递归解法</span>
      </div>
      <div className="code-content">
        <pre className="code-pre">
          {CODE_LINES.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = lineNumber === highlightLine;
            const variable = getVariableForLine(lineNumber);

            return (
              <div 
                key={index} 
                className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
              >
                <span className="line-number">{lineNumber}</span>
                <span className="line-content">
                  <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }} />
                </span>
                {variable && (
                  <span className="variable-value">
                    <span className="var-name">{variable.name}</span>
                    <span className="var-equals">=</span>
                    <span className="var-val">{variable.value}</span>
                  </span>
                )}
              </div>
            );
          })}
        </pre>
      </div>
      {currentStep && currentStep.callStack.length > 0 && (
        <div className="call-stack">
          <div className="call-stack-title">调用栈</div>
          <div className="call-stack-items">
            {currentStep.callStack.map((frame, index) => (
              <div key={index} className="stack-frame">
                <span className="frame-func">maxDepth</span>
                <span className="frame-args">
                  (node={frame.nodeVal ?? 'null'})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 简单的语法高亮
function syntaxHighlight(code: string): string {
  return code
    .replace(/\b(public|int|if|return|null)\b/g, '<span class="keyword">$1</span>')
    .replace(/\b(TreeNode|Math)\b/g, '<span class="type">$1</span>')
    .replace(/\b(maxDepth|max)\b/g, '<span class="function">$1</span>')
    .replace(/\b(root|left|right|leftDepth|rightDepth)\b/g, '<span class="variable">$1</span>')
    .replace(/(\d+)/g, '<span class="number">$1</span>');
}

export default CodeDisplay;
