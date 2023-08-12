const getNodeToExtract = (path) => {
  try {
    // Find the appropriate node to extract the source code from
    let nodeToExtract = path.node;

    if (path.isArrowFunctionExpression() || path.isFunctionExpression()) {
      // If inside an assignment expression, use the ancestor node
      const assignmentExpression = path.findParent((p) =>
        p.isAssignmentExpression()
      );
      if (assignmentExpression) {
        nodeToExtract = assignmentExpression.node;
      }
    }

    return nodeToExtract;
  } catch (error) {
    logErrorRed(
      `Error getting node to extract for ${getNodeName(path.node)}: ${error}`
    );
  }
};

module.exports = getNodeToExtract;
