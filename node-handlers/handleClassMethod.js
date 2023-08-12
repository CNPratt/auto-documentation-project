const { logErrorRed } = require("../utils/console-utils/chalkUtils");
const createObject = require("../utils/generation-utils/createObject");
const getNodeName = require("../utils/generation-utils/getNodeName");

const handleClassMethod = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    const nodeName = getNodeName(path.node);

    const methodObject = createObject(nodeName, path, code);

    methodObject.arrayPath = [
      ...currentPathArray,
      { key: "functions", scope: currentScope.name },
    ];

    console.log(`Pushing ${methodObject.name} to ${currentScope.name}`);

    currentScope.functions.push(methodObject);
    stack.push(methodObject);
    currentPathArray.push({ key: "functions", scope: currentScope.name });
  } catch (error) {
    logErrorRed(
      `Error handling class method for ${getNodeName(path.node)}: ${error}`
    );
  }
};

module.exports = handleClassMethod;
