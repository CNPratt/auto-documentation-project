const { logErrorRed } = require("../utils/console-utils/chalkUtils");
const createObject = require("../utils/generation-utils/createObject");
const getNodeName = require("../utils/generation-utils/getNodeName");

const handleVariableArrowFunction = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    const nodeName = getNodeName(path.node);

    console.log(`VARIABLE DEC ARROW FUNCTION OMITTED: ${nodeName}`);

    const functionObject = createObject(nodeName, path, code);

    functionObject.arrayPath = [
      ...currentPathArray,
      { key: "functions", scope: currentScope.name },
    ];

    console.log(`Pushing ${functionObject.name} to ${currentScope.name}`);

    currentScope.functions.push(functionObject);

    // Don't push to stack because it's a variable declaration for a function
    // And we want to preserve this scope level in order to add the function itself
    // to the appropriate scope level

    // stack.push(functionObject);
  } catch (error) {
    logErrorRed(
      `Error handling variable arrow function for ${getNodeName(
        path.node
      )}: ${error}`
    );
  }
};

module.exports = handleVariableArrowFunction;
