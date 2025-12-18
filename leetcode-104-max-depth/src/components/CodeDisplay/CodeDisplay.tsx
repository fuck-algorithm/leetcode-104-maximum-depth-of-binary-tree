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
  const callStack = currentStep?.callStack ?? [];

  const getVariableForLine = (lineIndex: number): VariableState | undefined => {
    return variables.find(v => v.line === lineIndex);
  };

  return (
    <div className="code-display">
      <div className="code-header">
        <span className="code-title">Java 代码</span>
        <span className="code-badge">递归解法</span>
      </div>
      
      {/* 算法复杂度提示 */}
      <div className="complexity-info">
        <div className="complexity-item">
          <span className="complexity-label">时间复杂度</span>
          <span className="complexity-value">O(n)</span>
        </div>
        <div className="complexity-item">
          <span className="complexity-label">空间复杂度</span>
          <span className="complexity-value">O(h)</span>
        </div>
        <div className="complexity-hint">n=节点数, h=树高度</div>
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

      {/* 变量状态面板 */}
      {currentStep && variables.length > 0 && (
        <div className="variables-panel">
          <div className="panel-title">当前变量状态</div>
          <div className="variables-grid">
            {variables.map((v, index) => (
              <div key={index} className="variable-card">
                <span className="variable-name">{v.name}</span>
                <span className="variable-val">{v.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 调用栈可视化 */}
      {currentStep && (
        <div className="call-stack">
          <div className="call-stack-header">
            <span className="call-stack-title">调用栈</span>
            <span className="stack-depth">深度: {callStack.length}</span>
          </div>
          {callStack.length > 0 ? (
            <div className="call-stack-items">
              {[...callStack].reverse().map((frame, index) => (
                <div 
                  key={index} 
                  className={`stack-frame ${index === 0 ? 'current-frame' : ''}`}
                >
                  <span className="frame-index">{callStack.length - index}</span>
                  <span className="frame-func">maxDepth</span>
                  <span className="frame-args">
                    (node=<span className="frame-node-val">{frame.nodeVal ?? 'null'}</span>)
                  </span>
                  {index === 0 && <span className="frame-indicator">← 当前</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-stack">栈为空</div>
          )}
        </div>
      )}

      {/* 算法思路提示 */}
      <div className="algorithm-hint">
        <div className="hint-title">💡 算法思路</div>
        <div className="hint-content">
          递归计算左右子树深度，取最大值加1即为当前节点的深度
        </div>
      </div>
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
