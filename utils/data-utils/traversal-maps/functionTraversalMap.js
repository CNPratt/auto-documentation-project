const returnJsx = require("../../ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
} = require("../../console-utils/chalkUtils");
const getCodeFromNode = require("../../ast-utils/getCodeFromNode");
const ComponentData = require("../../../classes/data/ComponentData");

// Exract each visitor to a reparate object

const functionTraversalMap = {
  FunctionDeclaration(path) {
    const identifier = "function";
    const nodeName = path.node.id.name;

    logWhite(`Identified ${identifier} declaration:`, nodeName);

    try {
      if (returnJsx(path.node.body)) {
        logCyan(`JSX found for ${nodeName}`);
        const componentObject = new ComponentData(nodeName, path.node);
        this.componentsArray.push(componentObject);
      } else {
        logWhite(`No JSX found for ${nodeName}`);
        if (path.scope.path.type === "Program") {
          logWhite(`Adding ${nodeName} to global functions array`);
          this.globalFunctionsArray.push({
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

module.exports = functionTraversalMap;
