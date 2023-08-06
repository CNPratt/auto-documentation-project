const generator = require("@babel/generator").default;
const fileClassTraversalMap = require("../file-maps/fileClassTraversalMap");
const fileFunctionTraversalMap = require("../file-maps/fileFunctionTraversalMap");
const fileVariableTraversalMap = require("../file-maps/fileVariableTraversalMap");
const {
  logErrorRed,
  logCyan,
} = require("../../utils/console-utils/chalkUtils");
const createAstFromNodeFragment = require("../../utils/ast-utils/createAstFromNodeFragment");
const babelTraverse = require("@babel/traverse").default;

const innerCodeTraversalMap = (type, codeName) => {
  const combinedTraversalMap = Object.assign(
    {},
    fileFunctionTraversalMap(type),
    fileClassTraversalMap(type),
    fileVariableTraversalMap(type)
  );

  const handleInnerCode = (path, context) => {
    try {
      if (path.parentPath.type === "Program") {
        logCyan(`Found inner code for ${codeName}`);

        // Get the scope of the current function
        const { scope } = path;

        // Get the bindings within the scope, which include variables, function declarations, etc.
        const bindings = scope.bindings;

        const bindingKeys = Object.keys(bindings);

        path.traverse(combinedTraversalMap, { ...context, bindingKeys });
      }
    } catch (error) {
      logErrorRed(`Error parsing inner code`, error.message);
    }
  };

  return {
    FunctionDeclaration(path) {
      handleInnerCode(path, this);
    },
    VariableDeclaration(path) {
      handleInnerCode(path, this);
    },
    ClassDeclaration(path) {
      handleInnerCode(path, this);
    },
  };
};

module.exports = innerCodeTraversalMap;
