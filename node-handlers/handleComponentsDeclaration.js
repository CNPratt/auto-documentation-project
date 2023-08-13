const { logErrorRed } = require("../utils/console-utils/chalkUtils");
const createObject = require("../utils/generation-utils/createObject");
const getNodeName = require("../utils/generation-utils/getNodeName");

const handleComponentsDeclaration = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  const nodeName = getNodeName(path.node);

  try {
    if (
      (path.isArrowFunctionExpression() || path.isFunctionExpression()) &&
      path.node.body.type === "JSXElement"
    ) {
      const componentName = path.parent.id.name;

      // This is a React functional component
      const componentObject = createObject(componentName, path, code);

      componentObject.arrayPath = [
        ...currentPathArray,
        { key: "components", scope: currentScope.name },
      ];

      currentScope.components.push(componentObject);
      stack.push(componentObject);

      currentPathArray.push({ key: "components", scope: currentScope.name });

      return true;
    }

    const superClass = path.node.superClass;

    if (
      path.isClassDeclaration() &&
      path.node.superClass &&
      (superClass.name === "Component" || superClass.name === "React.Component")
    ) {
      // This is a React class component
      const classObject = createObject(nodeName, path, code);

      classObject.arrayPath = [
        ...currentPathArray,
        { key: "components", scope: currentScope.name },
      ];

      currentScope.components.push(classObject);
      stack.push(classObject);
      currentPathArray.push({ key: "components", scope: currentScope.name });

      return true;
    }
  } catch (error) {
    logErrorRed(
      `Error handling components declaration for ${getNodeName(
        path.node
      )}: ${error}`
    );
  }

  return false;
};

module.exports = handleComponentsDeclaration;
