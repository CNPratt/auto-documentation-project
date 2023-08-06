const generator = require("@babel/generator").default;
const fileClassTraversalMap = require("../file-maps/fileClassTraversalMap");
const fileFunctionTraversalMap = require("../file-maps/fileFunctionTraversalMap");
const fileVariableTraversalMap = require("../file-maps/fileVariableTraversalMap");
const {
  logErrorRed,
  logCyan,
} = require("../../utils/console-utils/chalkUtils");

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

        path.traverse(combinedTraversalMap, context);
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
