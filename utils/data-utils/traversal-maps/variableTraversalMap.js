const returnJsx = require("../../ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
} = require("../../console-utils/chalkUtils");
const getCodeFromNode = require("../../ast-utils/getCodeFromNode");
const ComponentData = require("../../../classes/data/ComponentData");

const variableTraversalMap = {
  VariableDeclaration(path) {
    const identifier = "variable";
    const nodeName = path.node.declarations[0].id.name;

    logWhite(`Identified ${identifier} declaration:`, nodeName);

    try {
      if (returnJsx(path.node.declarations[0].init)) {
        logCyan(`JSX found for ${nodeName}`);
        if (
          path.node.declarations[0].init &&
          path.node.declarations[0].init.type === "ArrowFunctionExpression"
        ) {
          const componentObject = new ComponentData(nodeName, path.node);
          this.componentsArray.push(componentObject);
        }
      } else {
        logWhite(`No JSX found for ${nodeName}`);
        if (path.scope.path.type === "Program") {
          logWhite(`Adding ${nodeName} to global variables array`);
          this.globalVariablesArray.push({
            name: nodeName,
            type: identifier,
            sourceCode: getCodeFromNode(path.node),
          });
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
