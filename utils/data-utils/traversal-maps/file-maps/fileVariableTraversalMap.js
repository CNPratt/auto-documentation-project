const returnJsx = require("../../../ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
} = require("../../../console-utils/chalkUtils");
const getCodeFromNode = require("../../../ast-utils/getCodeFromNode");

const fileVariableTraversalMap = (type) => {
  return {
    VariableDeclaration(path) {
      const identifier = "variable";
      const nodeName = path.node.declarations[0].id.name;

      logWhite(`Identified ${identifier} declaration:`, nodeName);

      try {
        const blockDocument = new type(nodeName, getCodeFromNode(path.node));

        if (returnJsx(path.node.declarations[0].init)) {
          logCyan(`JSX found for ${nodeName}`);

          this.components.push(blockDocument);
        } else {
          logWhite(`No JSX found for ${nodeName}`);
          if (path.parentPath.type === "Program" || this.isBlock) {
            if (
              path.node.declarations[0].init &&
              path.node.declarations[0].init.type === "ArrowFunctionExpression"
            ) {
              logWhite(`Adding ${nodeName} to global functions array`);
              this.functions.push(blockDocument);
            } else {
              logWhite(`Adding ${nodeName} to global variables array`);
              this.variables.push(blockDocument);
            }
          }
        }
      } catch (error) {
        logErrorRed(
          `Error parsing ${identifier} ` + nodeName + ":",
          error.message
        );
      }
    },
  };
};

module.exports = fileVariableTraversalMap;
