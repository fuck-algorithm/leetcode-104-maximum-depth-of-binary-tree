// 二叉树节点定义
export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

// 算法执行步骤
export interface AlgorithmStep {
  stepNumber: number;
  description: string;
  highlightLine: number;
  variables: VariableState[];
  currentNode: TreeNode | null;
  currentDepth: number;
  maxDepth: number;
  callStack: CallStackFrame[];
  visitedNodes: number[];
}

// 变量状态
export interface VariableState {
  name: string;
  value: string;
  line: number;
}

// 调用栈帧
export interface CallStackFrame {
  nodeVal: number | null;
  depth: number;
}

// 播放状态
export interface PlaybackState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
}

// 用户输入数据
export interface InputData {
  raw: string;
  parsed: (number | null)[];
  isValid: boolean;
  errorMessage: string;
}

// 示例数据
export interface ExampleData {
  name: string;
  data: string;
  expected: number;
}
