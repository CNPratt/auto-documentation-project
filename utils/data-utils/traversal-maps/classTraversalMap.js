const returnJsx = require("../../ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
} = require("../../console-utils/chalkUtils");
const getCodeFromNode = require("../../ast-utils/getCodeFromNode");
const CodeBlockDocument = require("../../../classes/documents/CodeBlockDocument");

const classTraversalMap = {
  ClassDeclaration(path) {
    const identifier = "class";
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
          logWhite(`Adding ${nodeName} to global classes array`);
          this.classes.push({
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

module.exports = classTraversalMap;
