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
  nodeReturns: Map<number, NodeReturnInfo>; // 节点返回值信息
  edgeLabels: EdgeLabel[]; // 边上的标签
  nodeAnnotations?: NodeAnnotation[]; // 节点上方的说明文本（可选）
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

// 节点返回值信息（用于显示递归返回值）
export interface NodeReturnInfo {
  nodeVal: number;
  leftDepth: number | null;
  rightDepth: number | null;
  returnValue: number | null;
  isComparing: boolean; // 是否正在比较左右子树
}

// 边标签信息（用于显示递归调用和返回）
export interface EdgeLabel {
  fromVal: number;
  toVal: number | null;
  label: string;
  type: 'call' | 'return'; // 调用还是返回
}

// 节点上方的说明文本
export interface NodeAnnotation {
  nodeVal: number;
  text: string;
  type: 'info' | 'action' | 'result'; // 信息、动作、结果
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
