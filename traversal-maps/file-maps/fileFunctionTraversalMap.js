const returnJsx = require("../../utils/ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
  logBlue,
} = require("../../utils/console-utils/chalkUtils");
const getCodeFromNode = require("../../utils/ast-utils/getCodeFromNode");
const { get } = require("@babel/traverse/lib/path/family");

// Exract each visitor to a reparate object

const fileFunctionTraversalMap = (type) => {
  return {
    FunctionDeclaration(path) {
      const identifier = "function";
      const nodeName = path.node.id.name;

      logWhite(`Identified ${identifier} declaration:`, nodeName);

      try {
        const blockDocument = new type(nodeName, getCodeFromNode(path.node));

        if (returnJsx(path.node.body)) {
          logCyan(`JSX found for ${nodeName}`);
          this.components.push(blockDocument);
        } else {
          logWhite(`No JSX found for ${nodeName}`);

          if (
            path.parentPath.type === "Program" ||
            (this.isBlock &&
              this.bindingKeys &&
              this.bindingKeys.includes(nodeName))
          ) {
            logWhite(`Adding ${nodeName} to global functions array`);
            this.functions.push(blockDocument);
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

module.exports = fileFunctionTraversalMap;
