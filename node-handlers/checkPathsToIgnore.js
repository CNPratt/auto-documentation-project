const checkPathsToIgnore = (path) => {
  // Ignore paths that are not relevant to the traversal
  // For example, we don't want to catch anonymous callback functions inside a call expression

  const pathsToIgnore = [
    path.isForStatement(),
    path.isIfStatement(),
    path.isWhileStatement(),
    path.isDoWhileStatement(),
    path.isCallExpression(),
  ];

  if (
    pathsToIgnore.some((pathToIgnore) => {
      return pathToIgnore;
    })
  ) {
    return true;
  }

  return false;
};

module.exports = checkPathsToIgnore;
