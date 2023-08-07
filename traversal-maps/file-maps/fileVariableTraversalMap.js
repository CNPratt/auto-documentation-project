const returnJsx = require("../../utils/ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
  logGray,
  logMagenta,
} = require("../../utils/console-utils/chalkUtils");
const getCodeFromNode = require("../../utils/ast-utils/getCodeFromNode");

const fileVariableTraversalMap = (type) => {
  return {
    VariableDeclaration(path) {
      const identifier = "variable";
      const nodeName = path.node.declarations[0].id.name;

      logWhite(`Identified ${identifier} declaration:`, nodeName);

      try {
        const blockDocument = new type(nodeName, getCodeFromNode(path.node));

        if (returnJsx(path.node.declarations[0].init)) {
          logGray(`JSX found for ${nodeName}`);
          if (
            path.parentPath.type === "Program" ||
            (this.isBlock &&
              this.bindingKeys &&
              this.bindingKeys.includes(nodeName))
          ) {
            this.components.push(blockDocument);
          }
        } else {
          logGray(`No JSX found for ${nodeName}`);

          if (
            path.parentPath.type === "Program" ||
            (this.isBlock &&
              this.bindingKeys &&
              this.bindingKeys.includes(nodeName))
          ) {
            if (
              path.node.declarations[0].init &&
              path.node.declarations[0].init.type === "ArrowFunctionExpression"
            ) {
              const arrayParent = this ? this.name : "global";
              logMagenta(
                `Adding ${nodeName} to ${arrayParent} functions array`
              );
              this.functions.push(blockDocument);
            } else {
              const arrayParent = this ? this.name : "global";
              logMagenta(
                `Adding ${nodeName} to ${arrayParent} variables array`
              );
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
