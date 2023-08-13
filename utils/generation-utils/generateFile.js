const traverse = require("@babel/traverse").default;
const pathUtil = require("path");

const findFileObjectByPath = require("./findFileObjectByPath");

// import node handlers
const handleVariableDeclaration = require("../../node-handlers/handleVariableDeclaration");
const handleVariableArrowFunction = require("../../node-handlers/handleVariableArrowFunction");
const handleFunctionDeclaration = require("../../node-handlers/handleFunctionDeclaration");
const handleClassDeclaration = require("../../node-handlers/handleClassDeclaration");
const handleClassMethod = require("../../node-handlers/handleClassMethod");
const handleClassProperty = require("../../node-handlers/handleClassProperty");
const handleArrowOrFunctionExpression = require("../../node-handlers/handleArrowOrFunctionExpression");
const handleComponentsDeclaration = require("../../node-handlers/handleComponentsDeclaration");
const checkPathsToIgnore = require("../../node-handlers/checkPathsToIgnore");
const compareResultWithPreviousDocs = require("./compareResultWithPreviousDocs");
const getHash = require("../file-utils/getHash");
const {
  logErrorRed,
  logGreen,
  logYellow,
} = require("../console-utils/chalkUtils");

function generateFile(ast, code, filePath) {
  let result = {
    name: filePath.split(pathUtil.sep).pop(),
    filepath: filePath,
    components: [],
    classes: [],
    functions: [],
    variables: [],
    arrayPath: [{ key: "root", scope: "root" }],
    sourceCode: () => code,
    sourceCodeHash: getHash(code),
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

  let previousFileObject;

  try {
    previousFileObject = findFileObjectByPath(result);

    if (previousFileObject) {
      if (previousFileObject.sourceCodeHash === result.sourceCodeHash) {
        logGreen(`No changes detected for ${result.name}`);

        result.description = previousFileObject.description;
      } else {
        logYellow(`Changes detected for ${result.name}`);
        compareResultWithPreviousDocs(result, previousFileObject);
      }
    } else {
      logYellow(`No previous docs found for ${result.name}`);
    }
  } catch (e) {
    logErrorRed(
      `Error getting previous file object for ${result.name}: ${e.message}`
    );
  }

  return result;
}

module.exports = generateFile;
