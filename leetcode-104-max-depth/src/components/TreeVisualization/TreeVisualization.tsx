import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { TreeNode, AlgorithmStep } from '../../types';
import { getTreeLayout } from '../../utils/treeUtils';
import './TreeVisualization.css';

interface TreeVisualizationProps {
  root: TreeNode | null;
  currentStep: AlgorithmStep | null;
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ root, currentStep }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    svg.attr('width', width).attr('height', height);

    if (!root) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#8b949e')
        .attr('font-size', '14px')
        .text('空树');
      return;
    }

    const positions = getTreeLayout(root, width, height);
    const visitedNodes = currentStep?.visitedNodes || [];
    const currentNodeVal = currentStep?.currentNode?.val;

    // 绘制连线
    const g = svg.append('g');
    
    positions.forEach(pos => {
      const node = pos.node;
      if (node.left) {
        const leftPos = positions.find(p => p.node === node.left);
        if (leftPos) {
          g.append('line')
            .attr('x1', pos.x)
            .attr('y1', pos.y)
            .attr('x2', leftPos.x)
            .attr('y2', leftPos.y)
            .attr('stroke', '#4a5568')
            .attr('stroke-width', 2);
        }
      }
      if (node.right) {
        const rightPos = positions.find(p => p.node === node.right);
        if (rightPos) {
          g.append('line')
            .attr('x1', pos.x)
            .attr('y1', pos.y)
            .attr('x2', rightPos.x)
            .attr('y2', rightPos.y)
            .attr('stroke', '#4a5568')
            .attr('stroke-width', 2);
        }
      }
    });

    // 绘制节点
    positions.forEach(pos => {
      const isVisited = visitedNodes.includes(pos.node.val);
      const isCurrent = pos.node.val === currentNodeVal;

      const nodeGroup = g.append('g')
        .attr('transform', `translate(${pos.x}, ${pos.y})`);

      // 节点圆圈
      nodeGroup.append('circle')
        .attr('r', 22)
        .attr('fill', isCurrent ? '#ffa116' : isVisited ? '#238636' : '#1e2a3a')
        .attr('stroke', isCurrent ? '#ffd700' : isVisited ? '#3fb950' : '#4a5568')
        .attr('stroke-width', isCurrent ? 3 : 2)
        .style('filter', isCurrent ? 'drop-shadow(0 0 8px rgba(255, 161, 22, 0.6))' : 'none');

      // 节点值
      nodeGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', isCurrent ? '#000' : '#fff')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(pos.node.val);

      // 深度标签
      if (isCurrent && currentStep) {
        nodeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '-35px')
          .attr('fill', '#ffa116')
          .attr('font-size', '11px')
          .text(`深度: ${currentStep.currentDepth}`);
      }
    });

  }, [root, currentStep]);

  return (
    <div className="tree-visualization" ref={containerRef}>
      <svg ref={svgRef}></svg>
      {currentStep && (
        <div className="step-info">
          <div className="step-description">{currentStep.description}</div>
          <div className="max-depth-display">
            当前最大深度: <span className="depth-value">{currentStep.maxDepth}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeVisualization;
