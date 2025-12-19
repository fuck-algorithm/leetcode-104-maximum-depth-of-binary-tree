import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { TreeNode, AlgorithmStep } from '../../types';
import { getTreeLayout } from '../../utils/treeUtils';
import './TreeVisualization.css';

interface TreeVisualizationProps {
  root: TreeNode | null;
  currentStep: AlgorithmStep | null;
}

// 计算树的统计信息
function getTreeStats(root: TreeNode | null): { nodeCount: number; height: number; leafCount: number } {
  if (!root) return { nodeCount: 0, height: 0, leafCount: 0 };
  
  let nodeCount = 0;
  let leafCount = 0;
  
  function countNodes(node: TreeNode | null, depth: number): number {
    if (!node) return depth - 1;
    nodeCount++;
    if (!node.left && !node.right) leafCount++;
    const leftHeight = countNodes(node.left, depth + 1);
    const rightHeight = countNodes(node.right, depth + 1);
    return Math.max(leftHeight, rightHeight);
  }
  
  const height = countNodes(root, 1);
  return { nodeCount, height, leafCount };
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ root, currentStep }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // 计算树的统计信息
  const treeStats = useMemo(() => getTreeStats(root), [root]);
  
  // 计算遍历进度
  const visitedCount = currentStep?.visitedNodes.length || 0;
  const progress = treeStats.nodeCount > 0 ? Math.round((visitedCount / treeStats.nodeCount) * 100) : 0;

  // 缩放控制函数
  const handleZoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(
        zoomRef.current.scaleBy, 1.3
      );
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(
        zoomRef.current.scaleBy, 0.7
      );
    }
  }, []);

  const handleZoomReset = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(
        zoomRef.current.transform, d3.zoomIdentity
      );
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight - 100; // 留出底部信息区域

    svg.attr('width', width).attr('height', height);

    // 创建主容器组，用于缩放和拖动
    const mainGroup = svg.append('g').attr('class', 'main-group');

    // 设置缩放行为
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3]) // 缩放范围
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    if (!root) {
      mainGroup.append('text')
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
    const callStack = currentStep?.callStack || [];
    const callStackNodeVals = callStack.map(f => f.nodeVal);
    const nodeReturns = currentStep?.nodeReturns || new Map();
    const edgeLabels = currentStep?.edgeLabels || [];

    // 绘制连线
    const g = mainGroup.append('g');
    
    positions.forEach(pos => {
      const node = pos.node;
      if (node.left) {
        const leftPos = positions.find(p => p.node === node.left);
        if (leftPos) {
          const isOnPath = callStackNodeVals.includes(node.val) && callStackNodeVals.includes(node.left.val);
          // 查找边标签
          const edgeLabel = edgeLabels.find(e => e.fromVal === node.val && e.toVal === node.left?.val);
          
          g.append('line')
            .attr('x1', pos.x)
            .attr('y1', pos.y)
            .attr('x2', leftPos.x)
            .attr('y2', leftPos.y)
            .attr('stroke', isOnPath ? '#ffa116' : '#4a5568')
            .attr('stroke-width', isOnPath ? 3 : 2)
            .attr('stroke-dasharray', isOnPath ? 'none' : 'none');
          
          // 绘制边标签
          if (edgeLabel) {
            const midX = (pos.x + leftPos.x) / 2 - 15;
            const midY = (pos.y + leftPos.y) / 2;
            const labelColor = edgeLabel.type === 'call' ? '#58a6ff' : '#3fb950';
            
            g.append('rect')
              .attr('x', midX - 35)
              .attr('y', midY - 10)
              .attr('width', 70)
              .attr('height', 18)
              .attr('rx', 4)
              .attr('fill', 'rgba(13, 17, 23, 0.9)')
              .attr('stroke', labelColor)
              .attr('stroke-width', 1);
            
            g.append('text')
              .attr('x', midX)
              .attr('y', midY + 3)
              .attr('text-anchor', 'middle')
              .attr('fill', labelColor)
              .attr('font-size', '10px')
              .attr('font-weight', '500')
              .text(edgeLabel.label);
          }
        }
      }
      if (node.right) {
        const rightPos = positions.find(p => p.node === node.right);
        if (rightPos) {
          const isOnPath = callStackNodeVals.includes(node.val) && callStackNodeVals.includes(node.right.val);
          // 查找边标签
          const edgeLabel = edgeLabels.find(e => e.fromVal === node.val && e.toVal === node.right?.val);
          
          g.append('line')
            .attr('x1', pos.x)
            .attr('y1', pos.y)
            .attr('x2', rightPos.x)
            .attr('y2', rightPos.y)
            .attr('stroke', isOnPath ? '#ffa116' : '#4a5568')
            .attr('stroke-width', isOnPath ? 3 : 2);
          
          // 绘制边标签
          if (edgeLabel) {
            const midX = (pos.x + rightPos.x) / 2 + 15;
            const midY = (pos.y + rightPos.y) / 2;
            const labelColor = edgeLabel.type === 'call' ? '#58a6ff' : '#3fb950';
            
            g.append('rect')
              .attr('x', midX - 35)
              .attr('y', midY - 10)
              .attr('width', 70)
              .attr('height', 18)
              .attr('rx', 4)
              .attr('fill', 'rgba(13, 17, 23, 0.9)')
              .attr('stroke', labelColor)
              .attr('stroke-width', 1);
            
            g.append('text')
              .attr('x', midX)
              .attr('y', midY + 3)
              .attr('text-anchor', 'middle')
              .attr('fill', labelColor)
              .attr('font-size', '10px')
              .attr('font-weight', '500')
              .text(edgeLabel.label);
          }
        }
      }
    });

    // 绘制节点
    positions.forEach(pos => {
      const isVisited = visitedNodes.includes(pos.node.val);
      const isCurrent = pos.node.val === currentNodeVal;
      const isOnCallStack = callStackNodeVals.includes(pos.node.val);
      const isLeaf = !pos.node.left && !pos.node.right;

      const nodeGroup = g.append('g')
        .attr('transform', `translate(${pos.x}, ${pos.y})`);

      // 节点圆圈
      let fillColor = '#1e2a3a';
      let strokeColor = '#4a5568';
      
      if (isCurrent) {
        fillColor = '#ffa116';
        strokeColor = '#ffd700';
      } else if (isOnCallStack) {
        fillColor = '#58a6ff';
        strokeColor = '#79c0ff';
      } else if (isVisited) {
        fillColor = '#238636';
        strokeColor = '#3fb950';
      }

      nodeGroup.append('circle')
        .attr('r', 22)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', isCurrent ? 3 : 2)
        .style('filter', isCurrent ? 'drop-shadow(0 0 8px rgba(255, 161, 22, 0.6))' : 'none');

      // 节点值
      nodeGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', isCurrent || isOnCallStack ? '#000' : '#fff')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(pos.node.val);

      // 叶子节点标记
      if (isLeaf && !isCurrent) {
        nodeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '38px')
          .attr('fill', '#8b949e')
          .attr('font-size', '10px')
          .text('叶');
      }

      // 深度标签（当前节点）
      if (isCurrent && currentStep) {
        nodeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '-35px')
          .attr('fill', '#ffa116')
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .text(`深度: ${currentStep.currentDepth}`);
      }

      // 显示节点的返回值信息
      const nodeReturnInfo = nodeReturns.get(pos.node.val);
      if (nodeReturnInfo && isVisited) {
        let infoY = -35;
        
        // 如果是当前节点，信息往上移
        if (isCurrent) {
          infoY = -50;
        }
        
        // 显示左右子树深度和返回值
        if (nodeReturnInfo.leftDepth !== null || nodeReturnInfo.rightDepth !== null) {
          const leftText = nodeReturnInfo.leftDepth !== null ? `L:${nodeReturnInfo.leftDepth}` : '';
          const rightText = nodeReturnInfo.rightDepth !== null ? `R:${nodeReturnInfo.rightDepth}` : '';
          const separator = leftText && rightText ? ' ' : '';
          const depthText = leftText + separator + rightText;
          
          if (depthText) {
            // 背景框
            const textWidth = depthText.length * 7 + 10;
            nodeGroup.append('rect')
              .attr('x', -textWidth / 2)
              .attr('y', infoY - 12)
              .attr('width', textWidth)
              .attr('height', 16)
              .attr('rx', 3)
              .attr('fill', nodeReturnInfo.isComparing ? 'rgba(255, 161, 22, 0.2)' : 'rgba(88, 166, 255, 0.15)')
              .attr('stroke', nodeReturnInfo.isComparing ? '#ffa116' : '#58a6ff')
              .attr('stroke-width', 1);
            
            nodeGroup.append('text')
              .attr('text-anchor', 'middle')
              .attr('dy', `${infoY}px`)
              .attr('fill', nodeReturnInfo.isComparing ? '#ffa116' : '#79c0ff')
              .attr('font-size', '10px')
              .attr('font-weight', '500')
              .text(depthText);
          }
        }
        
        // 显示返回值
        if (nodeReturnInfo.returnValue !== null) {
          nodeGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '40px')
            .attr('fill', '#3fb950')
            .attr('font-size', '11px')
            .attr('font-weight', '600')
            .text(`返回:${nodeReturnInfo.returnValue}`);
        }
      }
    });

  }, [root, currentStep]);

  return (
    <div className="tree-visualization" ref={containerRef}>
      {/* 缩放控制按钮 */}
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={handleZoomIn} title="放大">
          <span>+</span>
        </button>
        <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
        <button className="zoom-btn" onClick={handleZoomOut} title="缩小">
          <span>−</span>
        </button>
        <button className="zoom-btn reset-btn" onClick={handleZoomReset} title="重置视图">
          <span>⟲</span>
        </button>
      </div>

      {/* 树统计信息面板 */}
      <div className="tree-stats-panel">
        <div className="stat-item">
          <span className="stat-label">节点数</span>
          <span className="stat-value">{treeStats.nodeCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">树高度</span>
          <span className="stat-value">{treeStats.height}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">叶节点</span>
          <span className="stat-value">{treeStats.leafCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">已访问</span>
          <span className="stat-value visited">{visitedCount}/{treeStats.nodeCount}</span>
        </div>
      </div>

      {/* 图例 */}
      <div className="tree-legend">
        <div className="legend-item">
          <span className="legend-dot current"></span>
          <span>当前节点</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot on-stack"></span>
          <span>调用栈中</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot visited"></span>
          <span>已访问</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot unvisited"></span>
          <span>未访问</span>
        </div>
      </div>

      <svg ref={svgRef}></svg>
      
      {currentStep && (
        <div className="step-info">
          <div className="step-info-left">
            <div className="step-description">{currentStep.description}</div>
            <div className="progress-info">
              <span className="progress-label">遍历进度:</span>
              <div className="mini-progress-bar">
                <div className="mini-progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="progress-percent">{progress}%</span>
            </div>
          </div>
          <div className="step-info-right">
            <div className="depth-info">
              <div className="depth-item">
                <span className="depth-label">当前深度</span>
                <span className="depth-value current-depth">{currentStep.currentDepth}</span>
              </div>
              <div className="depth-item">
                <span className="depth-label">最大深度</span>
                <span className="depth-value max-depth">{currentStep.maxDepth}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeVisualization;
