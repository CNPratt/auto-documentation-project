const returnJsx = require("../../utils/ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
} = require("../../utils/console-utils/chalkUtils");
const getCodeFromNode = require("../../utils/ast-utils/getCodeFromNode");

const fileClassTraversalMap = (type) => {
  return {
    ClassDeclaration(path) {
      const identifier = "class";
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
            logWhite(`Adding ${nodeName} to global classes array`);
            this.classes.push(blockDocument);
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

module.exports = fileClassTraversalMap;
