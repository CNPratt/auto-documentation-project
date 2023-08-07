const fileClassTraversalMap = require("../file-maps/fileClassTraversalMap");
const fileFunctionTraversalMap = require("../file-maps/fileFunctionTraversalMap");
const fileVariableTraversalMap = require("../file-maps/fileVariableTraversalMap");
const {
  logErrorRed,
  logCyan,
  logGray,
  logMagenta,
  logYellow,
  logNativeGreen,
  logBgYellow,
} = require("../../utils/console-utils/chalkUtils");
const t = require("@babel/types");
const createAstFromNodeFragment = require("../../utils/ast-utils/createAstFromNodeFragment");
const generator = require("@babel/generator").default;
const getCodeFromNode = require("../../utils/ast-utils/getCodeFromNode");
const classMethodTraversalMap = require("./classMethodTraversalMap");
const classPropertyTraversalMap = require("./classPropertyTraversalMap");

const innerCodeTraversalMap = (type, codeName) => {
  const handleInnerCode = (path, context) => {
    logGray(`Parent path type:`, path.parentPath.type);

    try {
      if (path.parentPath.type === "Program") {
        // logCyan(`Found inner code for ${codeName}`);

        // Get the scope of the current function
        const { scope } = path;

        // Get the bindings within the scope, which include variables, function declarations, etc.
        const bindings = scope.bindings;

        const bindingKeys = Object.keys(bindings);

        // console.log("bindingKeys", bindingKeys);

        path.traverse(combinedTraversalMap, { ...context, bindingKeys });
      } else {
        logBgYellow(`Path aborted: not a program`);
      }
    } catch (error) {
      logErrorRed(`Error parsing inner code`, error.message);
    }
  };

  const combinedTraversalMap = Object.assign(
    {},
    fileFunctionTraversalMap(type),
    fileClassTraversalMap(type),
    fileVariableTraversalMap(type),
    classMethodTraversalMap(type, handleInnerCode),
    classPropertyTraversalMap(type, handleInnerCode)
  );

  return {
    FunctionDeclaration(path) {
      const name = path.node.id.name;
      logCyan(`Found function declaration:`, name);
      handleInnerCode(path, this);
    },
    VariableDeclaration(path) {
      const name = path.node.declarations[0].id.name;
      logCyan(`Found variable declaration:`, name);
      handleInnerCode(path, this);
    },
    ClassDeclaration(path) {
      const name = path.node.id.name;
      logCyan(`Found class declaration:`, name);
      handleInnerCode(path, this);
    },
  };
};

module.exports = innerCodeTraversalMap;
