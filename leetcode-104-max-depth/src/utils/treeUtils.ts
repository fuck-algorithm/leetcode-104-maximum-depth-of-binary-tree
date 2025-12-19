import type { TreeNode, AlgorithmStep, CallStackFrame, NodeReturnInfo, EdgeLabel } from '../types';

// 从数组构建二叉树
export function buildTreeFromArray(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;

  const root: TreeNode = { val: arr[0], left: null, right: null };
  const queue: (TreeNode | null)[] = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const current = queue.shift();
    if (current === null || current === undefined) continue;

    // 左子节点
    if (i < arr.length) {
      if (arr[i] !== null) {
        current.left = { val: arr[i] as number, left: null, right: null };
        queue.push(current.left);
      } else {
        queue.push(null);
      }
      i++;
    }

    // 右子节点
    if (i < arr.length) {
      if (arr[i] !== null) {
        current.right = { val: arr[i] as number, left: null, right: null };
        queue.push(current.right);
      } else {
        queue.push(null);
      }
      i++;
    }
  }

  return root;
}

// 解析用户输入
export function parseInput(input: string): { data: (number | null)[]; isValid: boolean; errorMessage: string } {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return { data: [], isValid: false, errorMessage: '请输入数据' };
  }

  // 移除方括号
  let cleaned = trimmed;
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    cleaned = cleaned.slice(1, -1);
  }

  if (!cleaned) {
    return { data: [], isValid: true, errorMessage: '' };
  }

  const parts = cleaned.split(',').map(s => s.trim());
  const result: (number | null)[] = [];

  for (const part of parts) {
    if (part === 'null' || part === '') {
      result.push(null);
    } else {
      const num = parseInt(part, 10);
      if (isNaN(num)) {
        return { data: [], isValid: false, errorMessage: `无效的数值: "${part}"` };
      }
      if (num < -100 || num > 100) {
        return { data: [], isValid: false, errorMessage: `数值超出范围 [-100, 100]: ${num}` };
      }
      result.push(num);
    }
  }

  if (result.length > 10000) {
    return { data: [], isValid: false, errorMessage: '节点数量超过限制 (最多10000个)' };
  }

  return { data: result, isValid: true, errorMessage: '' };
}

// 生成随机二叉树数据
export function generateRandomTree(nodeCount: number = 7): (number | null)[] {
  if (nodeCount <= 0) return [];
  
  const result: (number | null)[] = [];
  const maxNodes = Math.min(nodeCount, 15);
  
  // 生成根节点
  result.push(Math.floor(Math.random() * 201) - 100);
  
  let nodesInLevel = 1;
  let addedNodes = 1;
  let currentDepth = 0;
  
  while (addedNodes < maxNodes) {
    const nextLevelNodes = nodesInLevel * 2;
    currentDepth++;
    
    // 根据深度调整生成概率，浅层更倾向于生成节点（更稠密）
    // 深度0-1: 95%概率生成节点
    // 深度2: 85%概率生成节点
    // 深度3+: 75%概率生成节点
    let generateProbability: number;
    if (currentDepth <= 1) {
      generateProbability = 0.95;
    } else if (currentDepth === 2) {
      generateProbability = 0.85;
    } else {
      generateProbability = 0.75;
    }
    
    let actualNodesInLevel = 0;
    for (let i = 0; i < nextLevelNodes && addedNodes < maxNodes; i++) {
      // 检查父节点是否存在
      const parentIndex = Math.floor((result.length) / 2);
      const parentExists = parentIndex < result.length && result[parentIndex] !== null;
      
      if (parentExists && Math.random() < generateProbability) {
        result.push(Math.floor(Math.random() * 201) - 100);
        addedNodes++;
        actualNodesInLevel++;
      } else if (parentExists) {
        result.push(null);
      } else {
        result.push(null);
      }
    }
    
    nodesInLevel = actualNodesInLevel > 0 ? nextLevelNodes : 0;
    
    // 如果这一层没有生成任何节点，停止
    if (actualNodesInLevel === 0) break;
  }
  
  // 移除末尾的null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  
  return result;
}

// 生成算法执行步骤
export function generateAlgorithmSteps(root: TreeNode | null): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepNumber = 0;
  
  // 用于跟踪节点返回值
  const nodeReturns = new Map<number, NodeReturnInfo>();
  
  // 初始步骤
  steps.push({
    stepNumber: stepNumber++,
    description: '开始执行 maxDepth 函数',
    highlightLine: 1,
    variables: [],
    currentNode: root,
    currentDepth: 0,
    maxDepth: 0,
    callStack: [],
    visitedNodes: [],
    nodeReturns: new Map(nodeReturns),
    edgeLabels: []
  });

  if (root === null) {
    steps.push({
      stepNumber: stepNumber++,
      description: '根节点为空，返回深度 0',
      highlightLine: 2,
      variables: [{ name: 'return', value: '0', line: 2 }],
      currentNode: null,
      currentDepth: 0,
      maxDepth: 0,
      callStack: [],
      visitedNodes: [],
      nodeReturns: new Map(nodeReturns),
      edgeLabels: []
    });
    return steps;
  }

  const visitedNodes: number[] = [];
  
  function dfs(node: TreeNode | null, depth: number, callStack: CallStackFrame[], parentVal: number | null): number {
    const edgeLabels: EdgeLabel[] = [];
    
    if (node === null) {
      // 添加返回边标签
      if (parentVal !== null) {
        edgeLabels.push({
          fromVal: parentVal,
          toVal: null,
          label: '返回 0',
          type: 'return'
        });
      }
      
      steps.push({
        stepNumber: stepNumber++,
        description: `节点为空，返回深度 0`,
        highlightLine: 2,
        variables: [{ name: 'return', value: '0', line: 2 }],
        currentNode: null,
        currentDepth: depth,
        maxDepth: Math.max(...steps.map(s => s.maxDepth), 0),
        callStack: [...callStack],
        visitedNodes: [...visitedNodes],
        nodeReturns: new Map(nodeReturns),
        edgeLabels
      });
      return 0;
    }

    visitedNodes.push(node.val);
    const newCallStack = [...callStack, { nodeVal: node.val, depth }];
    
    // 初始化节点返回信息
    nodeReturns.set(node.val, {
      nodeVal: node.val,
      leftDepth: null,
      rightDepth: null,
      returnValue: null,
      isComparing: false
    });

    // 添加调用边标签
    if (parentVal !== null) {
      edgeLabels.push({
        fromVal: parentVal,
        toVal: node.val,
        label: `调用 maxDepth(${node.val})`,
        type: 'call'
      });
    }

    steps.push({
      stepNumber: stepNumber++,
      description: `访问节点 ${node.val}，当前深度 ${depth + 1}`,
      highlightLine: 3,
      variables: [
        { name: 'node.val', value: String(node.val), line: 3 },
        { name: 'depth', value: String(depth + 1), line: 3 }
      ],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), depth + 1),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes],
      nodeReturns: new Map(nodeReturns),
      edgeLabels
    });

    // 递归左子树
    const leftCallLabel: EdgeLabel[] = node.left ? [{
      fromVal: node.val,
      toVal: node.left.val,
      label: `调用左子树`,
      type: 'call'
    }] : [];
    
    steps.push({
      stepNumber: stepNumber++,
      description: `递归计算节点 ${node.val} 的左子树深度`,
      highlightLine: 4,
      variables: [{ name: 'leftDepth', value: '计算中...', line: 4 }],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), depth + 1),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes],
      nodeReturns: new Map(nodeReturns),
      edgeLabels: leftCallLabel
    });

    const leftDepth = dfs(node.left, depth + 1, newCallStack, node.val);
    
    // 更新节点返回信息
    const nodeInfo = nodeReturns.get(node.val)!;
    nodeInfo.leftDepth = leftDepth;
    nodeReturns.set(node.val, nodeInfo);

    const leftReturnLabel: EdgeLabel[] = [{
      fromVal: node.val,
      toVal: node.left?.val ?? null,
      label: `左子树返回 ${leftDepth}`,
      type: 'return'
    }];

    steps.push({
      stepNumber: stepNumber++,
      description: `节点 ${node.val} 的左子树深度计算完成: ${leftDepth}`,
      highlightLine: 4,
      variables: [{ name: 'leftDepth', value: String(leftDepth), line: 4 }],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), depth + 1),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes],
      nodeReturns: new Map(nodeReturns),
      edgeLabels: leftReturnLabel
    });

    // 递归右子树
    const rightCallLabel: EdgeLabel[] = node.right ? [{
      fromVal: node.val,
      toVal: node.right.val,
      label: `调用右子树`,
      type: 'call'
    }] : [];
    
    steps.push({
      stepNumber: stepNumber++,
      description: `递归计算节点 ${node.val} 的右子树深度`,
      highlightLine: 5,
      variables: [
        { name: 'leftDepth', value: String(leftDepth), line: 4 },
        { name: 'rightDepth', value: '计算中...', line: 5 }
      ],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), depth + 1),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes],
      nodeReturns: new Map(nodeReturns),
      edgeLabels: rightCallLabel
    });

    const rightDepth = dfs(node.right, depth + 1, newCallStack, node.val);
    
    // 更新节点返回信息
    nodeInfo.rightDepth = rightDepth;
    nodeReturns.set(node.val, nodeInfo);

    const rightReturnLabel: EdgeLabel[] = [{
      fromVal: node.val,
      toVal: node.right?.val ?? null,
      label: `右子树返回 ${rightDepth}`,
      type: 'return'
    }];

    steps.push({
      stepNumber: stepNumber++,
      description: `节点 ${node.val} 的右子树深度计算完成: ${rightDepth}`,
      highlightLine: 5,
      variables: [
        { name: 'leftDepth', value: String(leftDepth), line: 4 },
        { name: 'rightDepth', value: String(rightDepth), line: 5 }
      ],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), depth + 1),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes],
      nodeReturns: new Map(nodeReturns),
      edgeLabels: rightReturnLabel
    });

    // 比较左右子树深度
    nodeInfo.isComparing = true;
    nodeReturns.set(node.val, nodeInfo);
    
    const maxD = Math.max(leftDepth, rightDepth) + 1;
    const comparison = leftDepth >= rightDepth ? 
      `左(${leftDepth}) ≥ 右(${rightDepth})` : 
      `右(${rightDepth}) > 左(${leftDepth})`;

    steps.push({
      stepNumber: stepNumber++,
      description: `比较: ${comparison}，取最大值 ${Math.max(leftDepth, rightDepth)} + 1 = ${maxD}`,
      highlightLine: 6,
      variables: [
        { name: 'leftDepth', value: String(leftDepth), line: 4 },
        { name: 'rightDepth', value: String(rightDepth), line: 5 },
        { name: 'max', value: String(Math.max(leftDepth, rightDepth)), line: 6 }
      ],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), maxD),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes],
      nodeReturns: new Map(nodeReturns),
      edgeLabels: []
    });

    // 更新返回值
    nodeInfo.returnValue = maxD;
    nodeInfo.isComparing = false;
    nodeReturns.set(node.val, nodeInfo);

    const returnLabel: EdgeLabel[] = parentVal !== null ? [{
      fromVal: parentVal,
      toVal: node.val,
      label: `返回 ${maxD}`,
      type: 'return'
    }] : [];

    steps.push({
      stepNumber: stepNumber++,
      description: `节点 ${node.val} 返回深度 ${maxD}`,
      highlightLine: 6,
      variables: [
        { name: 'leftDepth', value: String(leftDepth), line: 4 },
        { name: 'rightDepth', value: String(rightDepth), line: 5 },
        { name: 'return', value: String(maxD), line: 6 }
      ],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), maxD),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes],
      nodeReturns: new Map(nodeReturns),
      edgeLabels: returnLabel
    });

    return maxD;
  }

  const finalDepth = dfs(root, 0, [], null);

  steps.push({
    stepNumber: stepNumber++,
    description: `算法执行完成，最大深度为 ${finalDepth}`,
    highlightLine: 6,
    variables: [{ name: '最终结果', value: String(finalDepth), line: 6 }],
    currentNode: null,
    currentDepth: 0,
    maxDepth: finalDepth,
    callStack: [],
    visitedNodes: [...visitedNodes],
    nodeReturns: new Map(nodeReturns),
    edgeLabels: []
  });

  return steps;
}

// 获取树的所有节点位置（用于D3可视化）
export interface NodePosition {
  node: TreeNode;
  x: number;
  y: number;
  depth: number;
}

export function getTreeLayout(root: TreeNode | null, width: number, height: number): NodePosition[] {
  if (!root) return [];

  const positions: NodePosition[] = [];
  const levelHeight = height / 5;
  
  // 第一遍：使用相对坐标计算布局
  function traverse(node: TreeNode | null, depth: number, left: number, right: number) {
    if (!node) return;
    
    const x = (left + right) / 2;
    const y = depth * levelHeight + 63;
    
    positions.push({ node, x, y, depth });
    
    const mid = (left + right) / 2;
    traverse(node.left, depth + 1, left, mid);
    traverse(node.right, depth + 1, mid, right);
  }
  
  traverse(root, 0, 0, width);
  
  // 第二遍：计算实际边界并居中
  if (positions.length > 0) {
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const treeWidth = maxX - minX;
    const offsetX = (width - treeWidth) / 2 - minX;
    
    // 应用偏移使树居中
    positions.forEach(p => {
      p.x += offsetX;
    });
  }
  
  return positions;
}
