const t = require("@babel/types");
const createAstFromNodeFragment = require("../../utils/ast-utils/createAstFromNodeFragment");
const generator = require("@babel/generator").default;
const {
  logMagenta,
  logCyan,
  logBgBlue,
} = require("../../utils/console-utils/chalkUtils");
const nodeReturnsJsx = require("../../utils/ast-utils/nodeReturnsJsx");

const classPropertyTraversalMap = (type, handleInnerCode) => {
  return {
    ClassProperty(path) {
      console.log("path.parentPath.type", path.parentPath.type);
      console.log("this.isBlock", this.isBlock);
      console.log("this.bindingKeys", this.bindingKeys);

      // Get the scope of the current function
      const { scope } = path;

      // Get the bindings within the scope, which include variables, function declarations, etc.
      const bindings = scope.bindings;

      const bindingKeys = Object.keys(bindings);

      console.log(bindingKeys);

      // this.bindingKeys = bindingKeys;

      // Create a new variable declaration
      const variableDeclaration = t.variableDeclaration("const", [
        t.variableDeclarator(t.identifier(path.node.key.name), path.node.value),
      ]);

      // variableDeclaration.parentPath = path.parentPath;
      variableDeclaration.scope = path.scope;

      const ast = createAstFromNodeFragment(variableDeclaration);

      const classPropertyDoc = new type(
        path.node.key.name,
        generator(ast).code
      );

      logCyan(
        `Found class property: ${path.node.key.name} with context: ${this.name}`
      );

      if (this.name === this.bindingKeys[0]) {
        if (nodeReturnsJsx(path.node.body)) {
          logMagenta(
            `Adding ${path.node.key.name} to ${this.name} class components`
          );
          this.components.push(classPropertyDoc);
        } else if (path.node.value.type === "ArrowFunctionExpression") {
          logMagenta(
            `Adding ${path.node.key.name} to ${this.name} class functions`
          );
          this.functions.push(classPropertyDoc);
        } else {
          logMagenta(
            `Adding ${path.node.key.name} to ${this.name} class variables`
          );
          this.variables.push(classPropertyDoc);
        }

        logMagenta(
          `Reason: BindingKey[0] is equal to context name: ${this.name}`
        );
      }

      logMagenta(`Declined ${path.node.key.name}`);

      if (!this.bindingKeys) {
        logMagenta(`Declined: bindingKeys is undefined`);
      }

      if (this.bindingKeys && this.bindingKeys[0] !== this.name) {
        logMagenta(
          `Declined: first bindingKey is not equal to context: ${this.name}`
        );
      }
    },
  };
};

module.exports = classPropertyTraversalMap;
