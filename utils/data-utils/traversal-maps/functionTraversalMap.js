const returnJsx = require("../../ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
  logBlue,
} = require("../../console-utils/chalkUtils");
const getCodeFromNode = require("../../ast-utils/getCodeFromNode");
const CodeBlockDocument = require("../../../classes/documents/CodeBlockDocument");

// Exract each visitor to a reparate object

const functionTraversalMap = {
  FunctionDeclaration(path) {
    const identifier = "function";
    const nodeName = path.node.id.name;

    logWhite(`Identified ${identifier} declaration:`, nodeName);

    try {
      if (returnJsx(path.node.body)) {
        logCyan(`JSX found for ${nodeName}`);
        const componentObject = new CodeBlockDocument(
          nodeName,
          getCodeFromNode(path.node)
        );
        this.components.push(componentObject);
      } else {
        logWhite(`No JSX found for ${nodeName}`);
        if (path.parentPath.type === "Program") {
          logWhite(`Adding ${nodeName} to global functions array`);
          this.functions.push({
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
