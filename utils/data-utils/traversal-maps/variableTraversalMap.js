const returnJsx = require("../../ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
} = require("../../console-utils/chalkUtils");
const getCodeFromNode = require("../../ast-utils/getCodeFromNode");
const ComponentData = require("../../../classes/data/code-blocks/CodeBlockData");

const variableTraversalMap = {
  VariableDeclaration(path) {
    const identifier = "variable";
    const nodeName = path.node.declarations[0].id.name;

    logWhite(`Identified ${identifier} declaration:`, nodeName);

    try {
      if (returnJsx(path.node.declarations[0].init)) {
        logCyan(`JSX found for ${nodeName}`);

        const componentObject = new ComponentData(nodeName, path.node);
        this.components.push(componentObject);
      } else {
        logWhite(`No JSX found for ${nodeName}`);
        if (path.parentPath.type === "Program") {
          if (
            path.node.declarations[0].init &&
            path.node.declarations[0].init.type === "ArrowFunctionExpression"
          ) {
            logWhite(`Adding ${nodeName} to global functions array`);
            this.functions.push({
              name: nodeName,
              type: identifier,
              sourceCode: getCodeFromNode(path.node),
            });
          } else {
            logWhite(`Adding ${nodeName} to global variables array`);
            this.variables.push({
              name: nodeName,
              type: identifier,
              sourceCode: getCodeFromNode(path.node),
            });
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

module.exports = variableTraversalMap;
