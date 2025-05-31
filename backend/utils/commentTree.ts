import type { SelectComment, ThreadedComment } from "../db/schema.ts";

export function buildCommentTree(comments: SelectComment[]): ThreadedComment[] {
  const commentMap = new Map<string, ThreadedComment>();
  const rootComments: ThreadedComment[] = [];

  // First pass, populate the map and initialize children arrays
  comments.forEach((comment) => {
    // Cast to threaded comment to allow adding children property
    const threadedComment: ThreadedComment = { ...comment, children: [] };
    commentMap.set(threadedComment.id, threadedComment);
  });

  // Second pass, build the tree
  comments.forEach((comment) => {
    if (comment.parent_comment_id) {
      // If it's a reply, find its parent and add it to the parent's children
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        // Ensure parent.children is initialized and add the child
        parent.children!.push(commentMap.get(comment.id)!);
      }
    } else {
      // If it's a top-level comment, add it to the rootComments array
      rootComments.push(commentMap.get(comment.id)!);
    }
  });

  // Sort root comments (e.g., by creation date)
  rootComments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // Optionally sort children within each parent
  // This recursive sort function would go here if needed:
  // function sortChildren(comment: ThreadedComment) {
  //   if (comment.children && comment.children.length > 0) {
  //     comment.children.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  //     comment.children.forEach(sortChildren);
  //   }
  // }
  // rootComments.forEach(sortChildren);

  return rootComments;
}
