const returnJsx = require("../../utils/ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
  logGray,
  logMagenta,
} = require("../../utils/console-utils/chalkUtils");
const getCodeFromNode = require("../../utils/ast-utils/getCodeFromNode");
const generator = require("@babel/generator").default;
const createAstFromNodeFragment = require("../../utils/ast-utils/createAstFromNodeFragment");
const classMethodTraversalMap = require("../codeblock-maps/classMethodTraversalMap");
const classPropertyTraversalMap = require("../codeblock-maps/classPropertyTraversalMap");
const t = require("@babel/types");

const fileClassTraversalMap = (type) => {
  return {
    ClassDeclaration(path) {
      const identifier = "class";
      const nodeName = path.node.id.name;

      logWhite(`Identified ${identifier} declaration:`, nodeName);

      try {
        const blockDocument = new type(nodeName, getCodeFromNode(path.node));

        if (returnJsx(path.node.body)) {
          logGray(`JSX found for ${nodeName}`);
          this.components.push(blockDocument);
        } else {
          logGray(`No JSX found for ${nodeName}`);

          if (
            path.parentPath.type === "Program" ||
            (this.isBlock &&
              this.bindingKeys &&
              this.bindingKeys.includes(nodeName))
          ) {
            const arrayParent = this ? this.name : "global";
            logMagenta(`Adding ${nodeName} to ${arrayParent} classes array`);
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
