const { logErrorRed } = require("../utils/console-utils/chalkUtils");
const createObject = require("../utils/generation-utils/createObject");
const getNodeName = require("../utils/generation-utils/getNodeName");

const handleFunctionDeclaration = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    const nodeName = getNodeName(path.node);

    const functionObject = createObject(nodeName, path, code);

    functionObject.arrayPath = [
      ...currentPathArray,
      { key: "functions", scope: currentScope.name },
    ];

    console.log(`Pushing ${functionObject.name} to ${currentScope.name}`);

    currentScope.functions.push(functionObject);
    stack.push(functionObject);
    currentPathArray.push({ key: "functions", scope: currentScope.name });
  } catch (error) {
    logErrorRed(
      `Error handling function declaration for ${getNodeName(
        path.node
      )}: ${error}`
    );
  }
};

module.exports = handleFunctionDeclaration;
