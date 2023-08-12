function replaceArrowFunctionVariableDeclaration(
  currentScope,
  functionName,
  functionObject
) {
  try {
    // Find the index of the function object with the matching name
    const index = currentScope.functions.findIndex(
      (func) => func.name === functionName
    );

    const newFunctionObject = {
      ...functionObject,
      sourceCode:
        index > -1
          ? currentScope.functions[index].sourceCode
          : functionObject.sourceCode,
    };

    // If the index is found, update the object at that index
    if (index !== -1) {
      currentScope.functions[index] = newFunctionObject;
    } else {
      // Optionally, you could handle the case where the function name is not found
      currentScope.functions.push(newFunctionObject);
    }

    return newFunctionObject;
  } catch (error) {
    logErrorRed(
      `Error replacing arrow function variable declaration for ${functionName}: ${error}`
    );
  }
}

module.exports = replaceArrowFunctionVariableDeclaration;
