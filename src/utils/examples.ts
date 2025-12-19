import type { ExampleData } from '../types';

export const EXAMPLE_DATA: ExampleData[] = [
  {
    name: '示例1',
    data: '[3,9,20,null,null,15,7]',
    expected: 3
  },
  {
    name: '示例2',
    data: '[1,null,2]',
    expected: 2
  },
  {
    name: '空树',
    data: '[]',
    expected: 0
  },
  {
    name: '单节点',
    data: '[1]',
    expected: 1
  },
  {
    name: '完全二叉树',
    data: '[1,2,3,4,5,6,7]',
    expected: 3
  },
  {
    name: '左斜树',
    data: '[1,2,null,3,null,4]',
    expected: 4
  }
];
