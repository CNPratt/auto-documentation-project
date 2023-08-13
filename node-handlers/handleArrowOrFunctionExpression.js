const { logErrorRed } = require("../utils/console-utils/chalkUtils");
const createObject = require("../utils/generation-utils/createObject");
const getNodeName = require("../utils/generation-utils/getNodeName");
const replaceArrowFunctionVariableDeclaration = require("./replaceArrowFunctionVariableDeclaration");

const handleArrowOrFunctionExpression = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    if (path.parentPath.isClassProperty()) {
      return;
    }

    let functionName = null;
    if (path.parent.type === "VariableDeclarator") {
      functionName = path.parent.id.name; // Function assigned to variable
    } else if (path.parent.type === "AssignmentExpression") {
      functionName = path.parent.left.property.name; // Function assigned to property
    }

    const functionObject = createObject(functionName, path, code);

    console.log(`Pushing ${functionObject.name} to ${currentScope.name}`);

    const newFunctionObject = replaceArrowFunctionVariableDeclaration(
      currentScope,
      functionName,
      functionObject
    );

    newFunctionObject.arrayPath = [
      ...currentPathArray,
      { key: "functions", scope: currentScope.name },
    ];

    stack.push(newFunctionObject);

    currentPathArray.push({ key: "functions", scope: currentScope.name });
  } catch (error) {
    logErrorRed(
      `Error handling arrow or function expression for ${getNodeName(
        path.node
      )}: ${error}`
    );
  }
};

module.exports = handleArrowOrFunctionExpression;
