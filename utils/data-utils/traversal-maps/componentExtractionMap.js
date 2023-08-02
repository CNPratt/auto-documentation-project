const returnJsx = require("../../ast-utils/nodeReturnsJsx");
const {
  logWhite,
  logCyan,
  logErrorRed,
} = require("../../console-utils/chalkUtils");
const createComponentObject = require("../../component-utils/createComponentObject");
const getCodeFromNode = require("../../ast-utils/getCodeFromNode");

const componentExtractionMap = {
  FunctionDeclaration(path) {
    const identifier = "function";
    const nodeName = path.node.id.name;

    logWhite(`Identified ${identifier} declaration:`, nodeName);

    try {
      if (returnJsx(path.node.body)) {
        logCyan(`JSX found for ${nodeName}`);
        const componentObject = createComponentObject(nodeName, path.node);
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
          const componentObject = createComponentObject(nodeName, path.node);
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

  ClassDeclaration(path) {
    const identifier = "class";
    const nodeName = path.node.id.name;

    logWhite(`Identified ${identifier} declaration:`, nodeName);

    try {
      if (returnJsx(path.node.body)) {
        logCyan(`JSX found for ${nodeName}`);
        const componentObject = createComponentObject(nodeName, path.node);
        this.componentsArray.push(componentObject);
      } else {
        logWhite(`No JSX found for ${nodeName}`);
        if (path.scope.path.type === "Program") {
          logWhite(`Adding ${nodeName} to global classes array`);
          this.globalClassesArray.push({
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

module.exports = componentExtractionMap;
