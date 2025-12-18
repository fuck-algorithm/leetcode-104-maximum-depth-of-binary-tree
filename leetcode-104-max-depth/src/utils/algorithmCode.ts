export const ALGORITHM_CODE = `public int maxDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    int leftDepth = maxDepth(root.left);
    int rightDepth = maxDepth(root.right);
    return Math.max(leftDepth, rightDepth) + 1;
}`;

export const CODE_LINES = ALGORITHM_CODE.split('\n');
