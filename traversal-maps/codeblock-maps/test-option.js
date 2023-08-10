const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const pathUtil = require("path");
const {
  logErrorRed,
  logBgBlue,
} = require("../../utils/console-utils/chalkUtils");
const getHash = require("../../utils/file-utils/getHash");

function createObject(name, sourceCode) {
  return {
    name,
    components: [],
    classes: [],
    functions: [],
    variables: [],
    stringSourceCode: sourceCode,
    sourceCode: () => sourceCode,
    sourceCodeHash: getHash(sourceCode),
    arrayPath: [],
  };
}

const getNodeName = (node) => {
  const nodeName =
    node?.name ||
    node?.key?.name ||
    node?.id?.name ||
    node?.left?.property?.name ||
    (node?.declarations && node?.declarations[0]?.id?.name) ||
    null;

  if (!nodeName) {
    logBgBlue(`No node name found for node`);
  }

  // logBgBlue(`Node name: ${nodeName}`);

  return nodeName;
};

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

const getSourceCode = (path, code) => {
  let nodeToExtract = getNodeToExtract(path);

  try {
    // Extract the source code for the node
    const sourceCode = code.substring(nodeToExtract.start, nodeToExtract.end);

    return sourceCode;
  } catch (error) {
    logErrorRed(
      `Error getting source code for ${getNodeName(path.node)}: ${error}`
    );
  }
};

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
      const componentObject = createObject(
        componentName,
        getSourceCode(path, code)
      );

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
      const classObject = createObject(nodeName, getSourceCode(path, code));

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

const handleFunctionDeclaration = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    const nodeName = getNodeName(path.node);

    const functionObject = createObject(nodeName, getSourceCode(path, code));

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

    const functionObject = createObject(
      functionName,
      getSourceCode(path, code)
    );

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

const handleClassProperty = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    // Handle class properties assigned to functions
    const nodeName = getNodeName(path.node);

    const functionObject = createObject(nodeName, getSourceCode(path, code));

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
      `Error handling class property for ${getNodeName(path.node)}: ${error}`
    );
  }
};

const handleClassDeclaration = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    const nodeName = getNodeName(path.node);

    const classObject = createObject(nodeName, getSourceCode(path, code));

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

    const functionObject = createObject(nodeName, getSourceCode(path, code));

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

const handleVariableDeclaration = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    const nodeName = getNodeName(path.node);

    const variableObject = createObject(nodeName, getSourceCode(path, code));

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

const handleClassMethod = (
  path,
  currentScope,
  stack,
  code,
  currentPathArray
) => {
  try {
    const nodeName = getNodeName(path.node);

    const methodObject = createObject(nodeName, getSourceCode(path, code));

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

function analyzeFile(ast, code, filePath) {
  const result = {
    name: filePath.split(pathUtil.sep).pop(),
    filepath: filePath,
    components: [],
    classes: [],
    functions: [],
    variables: [],
  };

  const stack = [result];
  const currentPathArray = [];

  traverse(ast, {
    enter(path) {
      const currentScope = stack[stack.length - 1];

      const isIgnoredPath = checkPathsToIgnore(path, currentScope, stack);

      if (isIgnoredPath) {
        return;
      }

      // console.log(stack.length, nodeName);

      // console.log(currentScope.name, path.node.type);

      const isComponent = handleComponentsDeclaration(
        path,
        currentScope,
        stack,
        code,
        currentPathArray
      );

      if (isComponent) {
        return;
      }

      if (path.isFunctionDeclaration()) {
        handleFunctionDeclaration(
          path,
          currentScope,
          stack,
          code,
          currentPathArray
        );
      } else if (
        path.isArrowFunctionExpression() ||
        path.isFunctionExpression()
      ) {
        handleArrowOrFunctionExpression(
          path,
          currentScope,
          stack,
          code,
          currentPathArray
        );
      } else if (
        path.isClassProperty() &&
        (path.node.value.type === "ArrowFunctionExpression" ||
          path.node.value.type === "FunctionExpression")
      ) {
        handleClassProperty(path, currentScope, stack, code, currentPathArray);
      } else if (path.isClassDeclaration()) {
        handleClassDeclaration(
          path,
          currentScope,
          stack,
          code,
          currentPathArray
        );
      } else if (path.isVariableDeclaration()) {
        // Handle arrow functions assigned to variables
        if (
          path.node.declarations[0].init &&
          path.node.declarations[0].init.type === "ArrowFunctionExpression"
        ) {
          handleVariableArrowFunction(
            path,
            currentScope,
            stack,
            code,
            currentPathArray
          );
        } else {
          handleVariableDeclaration(
            path,
            currentScope,
            stack,
            code,
            currentPathArray
          );
        }
      } else if (path.isClassMethod()) {
        handleClassMethod(path, currentScope, stack, code, currentPathArray);
      }
    },
    exit(path) {
      if (
        path.isFunctionDeclaration() ||
        path.isArrowFunctionExpression() ||
        path.isFunctionExpression() ||
        path.isClassDeclaration() ||
        path.isClassMethod()
      ) {
        console.log(`Popping ${stack[stack.length - 1].name}`);
        stack.pop();
        currentPathArray.pop();
      }
    },
  });

  return result;
}

// console.log(JSON.stringify(result, null, 2));

module.exports = analyzeFile;
