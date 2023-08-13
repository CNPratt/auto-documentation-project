const { logErrorRed } = require("../utils/console-utils/chalkUtils");
const createObject = require("../utils/generation-utils/createObject");
const getNodeName = require("../utils/generation-utils/getNodeName");

const handleVariableDeclaration = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    const nodeName = getNodeName(path.node);

    const variableObject = createObject(nodeName, path, code);

    variableObject.arrayPath = [
      ...currentPathArray,
      { key: "variables", scope: currentScope.name },
    ];

    console.log(`Pushing ${variableObject.name} to ${currentScope.name}`);

    currentScope.variables.push(variableObject);
  } catch (error) {
    logErrorRed(
      `Error handling variable declaration for ${getNodeName(
        path.node
      )}: ${error}`
    );
  }
};

module.exports = handleVariableDeclaration;
