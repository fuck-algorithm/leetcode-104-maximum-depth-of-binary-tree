import type { TreeNode, AlgorithmStep, CallStackFrame } from '../types';

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
  
  while (addedNodes < maxNodes) {
    const nextLevelNodes = nodesInLevel * 2;
    for (let i = 0; i < nextLevelNodes && addedNodes < maxNodes; i++) {
      // 随机决定是否添加节点
      if (Math.random() > 0.3) {
        result.push(Math.floor(Math.random() * 201) - 100);
        addedNodes++;
      } else {
        result.push(null);
      }
    }
    nodesInLevel = nextLevelNodes;
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
    visitedNodes: []
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
      visitedNodes: []
    });
    return steps;
  }

  const visitedNodes: number[] = [];
  
  function dfs(node: TreeNode | null, depth: number, callStack: CallStackFrame[]): number {
    if (node === null) {
      steps.push({
        stepNumber: stepNumber++,
        description: `节点为空，返回深度 0`,
        highlightLine: 2,
        variables: [{ name: 'return', value: '0', line: 2 }],
        currentNode: null,
        currentDepth: depth,
        maxDepth: Math.max(...steps.map(s => s.maxDepth), 0),
        callStack: [...callStack],
        visitedNodes: [...visitedNodes]
      });
      return 0;
    }

    visitedNodes.push(node.val);
    const newCallStack = [...callStack, { nodeVal: node.val, depth }];

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
      visitedNodes: [...visitedNodes]
    });

    // 递归左子树
    steps.push({
      stepNumber: stepNumber++,
      description: `递归计算左子树深度`,
      highlightLine: 4,
      variables: [{ name: 'leftDepth', value: '计算中...', line: 4 }],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), depth + 1),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes]
    });

    const leftDepth = dfs(node.left, depth + 1, newCallStack);

    steps.push({
      stepNumber: stepNumber++,
      description: `左子树深度计算完成: ${leftDepth}`,
      highlightLine: 4,
      variables: [{ name: 'leftDepth', value: String(leftDepth), line: 4 }],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), depth + 1),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes]
    });

    // 递归右子树
    steps.push({
      stepNumber: stepNumber++,
      description: `递归计算右子树深度`,
      highlightLine: 5,
      variables: [
        { name: 'leftDepth', value: String(leftDepth), line: 4 },
        { name: 'rightDepth', value: '计算中...', line: 5 }
      ],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), depth + 1),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes]
    });

    const rightDepth = dfs(node.right, depth + 1, newCallStack);

    steps.push({
      stepNumber: stepNumber++,
      description: `右子树深度计算完成: ${rightDepth}`,
      highlightLine: 5,
      variables: [
        { name: 'leftDepth', value: String(leftDepth), line: 4 },
        { name: 'rightDepth', value: String(rightDepth), line: 5 }
      ],
      currentNode: node,
      currentDepth: depth + 1,
      maxDepth: Math.max(...steps.map(s => s.maxDepth), depth + 1),
      callStack: newCallStack,
      visitedNodes: [...visitedNodes]
    });

    const maxD = Math.max(leftDepth, rightDepth) + 1;

    steps.push({
      stepNumber: stepNumber++,
      description: `返回 max(${leftDepth}, ${rightDepth}) + 1 = ${maxD}`,
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
      visitedNodes: [...visitedNodes]
    });

    return maxD;
  }

  const finalDepth = dfs(root, 0, []);

  steps.push({
    stepNumber: stepNumber++,
    description: `算法执行完成，最大深度为 ${finalDepth}`,
    highlightLine: 6,
    variables: [{ name: '最终结果', value: String(finalDepth), line: 6 }],
    currentNode: null,
    currentDepth: 0,
    maxDepth: finalDepth,
    callStack: [],
    visitedNodes: [...visitedNodes]
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
  
  function traverse(node: TreeNode | null, depth: number, left: number, right: number) {
    if (!node) return;
    
    const x = (left + right) / 2;
    const y = depth * levelHeight + 40;
    
    positions.push({ node, x, y, depth });
    
    const mid = (left + right) / 2;
    traverse(node.left, depth + 1, left, mid);
    traverse(node.right, depth + 1, mid, right);
  }
  
  traverse(root, 0, 0, width);
  return positions;
}
