const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const path = require("path");

function createObject(name, sourceCode) {
  return {
    name,
    components: [],
    classes: [],
    functions: [],
    variables: [],
    sourceCode,
  };
}

function updateFunctionObject(currentScope, functionName, functionObject) {
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
}

const getNodeToExtract = (path) => {
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
};

const getSourceCode = (path, code) => {
  let nodeToExtract = getNodeToExtract(path);

  // Extract the source code for the node
  const sourceCode = code.substring(nodeToExtract.start, nodeToExtract.end);

  return sourceCode;
};

const handleComponentsDeclaration = (path, currentScope, stack, code) => {
  if (
    (path.isArrowFunctionExpression() || path.isFunctionExpression()) &&
    path.node.body.type === "JSXElement"
  ) {
    // This is a React functional component
    const componentName = getComponentName(path); // Implement this function to extract the name
    const componentObject = createObject(
      componentName,
      getSourceCode(path, code)
    );
    currentScope.components.push(componentObject);
    stack.push(componentObject);

    return true;
  }

  const superClass = path.node.superClass;

  if (
    path.isClassDeclaration() &&
    path.node.superClass &&
    (superClass.name === "Component" || superClass.name === "React.Component")
  ) {
    // This is a React class component
    const className = path.node.id.name;
    const classObject = createObject(className, getSourceCode(path, code));
    currentScope.components.push(classObject);
    stack.push(classObject);

    return true;
  }

  return false;
};

const handleFunctionDeclaration = (path, currentScope, stack, code) => {
  const functionName = path.node.id ? path.node.id.name : null;
  const functionObject = createObject(functionName, getSourceCode(path, code));

  console.log(`Pushing ${functionObject.name} to ${currentScope.name}`);
  currentScope.functions.push(functionObject);
  stack.push(functionObject);
};

const handleArrowOrFunctionExpression = (path, currentScope, stack, code) => {
  if (path.parentPath.isClassProperty()) {
    return;
  }

  let functionName = null;
  if (path.parent.type === "VariableDeclarator") {
    functionName = path.parent.id.name; // Function assigned to variable
  } else if (path.parent.type === "AssignmentExpression") {
    functionName = path.parent.left.property.name; // Function assigned to property
  }
  const functionObject = createObject(functionName, getSourceCode(path, code));

  console.log(`Pushing ${functionObject.name} to ${currentScope.name}`);

  const newFunctionObject = updateFunctionObject(
    currentScope,
    functionName,
    functionObject
  );

  // currentScope.functions[functionName] = newFunctionObject;
  stack.push(newFunctionObject);
};

const handleClassProperty = (path, currentScope, stack, code) => {
  // Handle class properties assigned to functions
  const functionName = path.node.key.name;
  const functionObject = createObject(functionName, getSourceCode(path, code));

  console.log(`Pushing ${functionObject.name} to ${currentScope.name}`);

  currentScope.functions.push(functionObject);
  stack.push(functionObject);
};

const handleClassDeclaration = (path, currentScope, stack, code) => {
  const className = path.node.id.name;
  const classObject = createObject(className, getSourceCode(path, code));

  console.log(`Pushing ${classObject.name} to ${currentScope.name}`);

  currentScope.classes.push(classObject);
  stack.push(classObject);
};

const handleVariableArrowFunction = (path, currentScope, stack, code) => {
  console.log("VARIABLE DEC ARROW FUNCTION OMITTED");

  const arrowFuncName = path.node.declarations[0].id.name;
  const functionObject = createObject(arrowFuncName, getSourceCode(path, code));

  console.log(`Pushing ${functionObject.name} to ${currentScope.name}`);

  currentScope.functions.push(functionObject);
  // stack.push(functionObject);
};

const handleVariableDeclaration = (path, currentScope, stack, code) => {
  const variableName = path.node.declarations[0].id.name;
  const variableObject = createObject(variableName, getSourceCode(path, code));

  console.log(`Pushing ${variableObject.name} to ${currentScope.name}`);

  currentScope.variables.push(variableObject);
};

const handleClassMethod = (path, currentScope, stack, code) => {
  const methodName = path.node.key.name;
  const methodObject = createObject(methodName, getSourceCode(path, code));

  console.log(`Pushing ${methodObject.name} to ${currentScope.name}`);

  currentScope.functions.push(methodObject);
  stack.push(methodObject);
};

function analyzeFile(ast, code) {
  const result = {
    name: filePath.split(path.sep).pop(),
    filepath: filePath,
    components: [],
    classes: [],
    functions: [],
    variables: [],
  };

  const stack = [result];

  traverse(ast, {
    enter(path) {
      const currentScope = stack[stack.length - 1];

      const nodeName =
        path.node?.name ||
        path.node?.key?.name ||
        path.node?.id?.name ||
        path.node?.left?.property?.name ||
        (path.node?.declarations && path.node?.declarations[0]?.id?.name) ||
        null;

      console.log(stack.length, nodeName);

      console.log(currentScope.name, path.node.type);

      const isComponent = handleComponentsDeclaration(
        path,
        currentScope,
        stack,
        code
      );

      if (isComponent) {
        return;
      }

      if (path.isFunctionDeclaration()) {
        handleFunctionDeclaration(path, currentScope, stack, code);
      } else if (
        path.isArrowFunctionExpression() ||
        path.isFunctionExpression()
      ) {
        handleArrowOrFunctionExpression(path, currentScope, stack, code);
      } else if (
        path.isClassProperty() &&
        (path.node.value.type === "ArrowFunctionExpression" ||
          path.node.value.type === "FunctionExpression")
      ) {
        handleClassProperty(path, currentScope, stack, code);
      } else if (path.isClassDeclaration()) {
        handleClassDeclaration(path, currentScope, stack, code);
      } else if (path.isVariableDeclaration()) {
        // Handle arrow functions assigned to variables
        if (
          path.node.declarations[0].init &&
          path.node.declarations[0].init.type === "ArrowFunctionExpression"
        ) {
          handleVariableArrowFunction(path, currentScope, stack, code);
        } else {
          handleVariableDeclaration(path, currentScope, stack, code);
        }
      } else if (path.isClassMethod()) {
        handleClassMethod(path, currentScope, stack, code);
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
      }
    },
  });

  return result;
}

// const filePath = "../../../../iforager_react_native/App.js";
// const filePath = "../../../../sample-react-project/src/App.js"; // Update this path
const filePath = "../../classes/documents/FileDocument.js"; // Update this path

// const projectFilePath = path.join(__dirname, filePath);

// const code = fs.readFileSync(projectFilePath, "utf-8");
// const ast = parser.parse(code, {
//   sourceType: "module",
//   plugins: ["jsx"], // Include if you are using JSX
// });

// const result = analyzeFile(ast, code);

// write to ../..//generated-documentation/generated-documentation.js
// const resultString = JSON.stringify(result);

// const resultStringWithExport = `module.exports = ${resultString}`;

// const buffer = Buffer.from(resultStringWithExport);

// fs.writeFileSync(
//   path.join(
//     __dirname,
//     "../../generated-documentation/generated-documentation.js"
//   ),
//   buffer
// );

// console.log(JSON.stringify(result, null, 2));

module.exports = analyzeFile;