const { logErrorRed } = require("../utils/console-utils/chalkUtils");
const createObject = require("../utils/generation-utils/createObject");
const getNodeName = require("../utils/generation-utils/getNodeName");

const handleClassDeclaration = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    const nodeName = getNodeName(path.node);

    const classObject = createObject(nodeName, path, code);

    console.log(`Pushing ${classObject.name} to ${currentScope.name}`);

    classObject.arrayPath = [
      ...currentPathArray,
      { key: "classes", scope: currentScope.name },
    ];

    currentScope.classes.push(classObject);
    stack.push(classObject);
    currentPathArray.push({ key: "classes", scope: currentScope.name });
  } catch (error) {
    logErrorRed(
      `Error handling class declaration for ${getNodeName(path.node)}: ${error}`
    );
  }
};

module.exports = handleClassDeclaration;
