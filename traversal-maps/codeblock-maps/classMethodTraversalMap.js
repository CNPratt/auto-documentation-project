const t = require("@babel/types");
const createAstFromNodeFragment = require("../../utils/ast-utils/createAstFromNodeFragment");
const generator = require("@babel/generator").default;
const { logMagenta, logCyan } = require("../../utils/console-utils/chalkUtils");

const classMethodTraversalMap = (type) => {
  return {
    ClassMethod(path) {
      console.log("path.parentPath.type", path.parentPath.type);
      console.log("this.isBlock", this.isBlock);
      console.log("this.bindingKeys", this.bindingKeys);

      // Create a new function declaration node
      const newFunction = t.functionDeclaration(
        t.identifier(path.node.key.name), // function name
        path.node.params, // parameters
        path.node.body // function body
      );

      // newFunction.parentPath = path.parentPath;
      newFunction.scope = path.scope;

      const ast = createAstFromNodeFragment(newFunction);

      console.log(generator(path.node).code);

      logCyan(
        `Found class method: ${path.node.key.name} with context: ${this.name}`
      );

      const classMethodDoc = new type(path.node.key.name, generator(ast).code);

      if (this.name === this.bindingKeys[0]) {
        logMagenta(
          `Adding ${path.node.key.name} to ${this.name} class functions`
        );
        logMagenta(
          `Reason: BindingKey[0] is equal to context name: ${this.name}`
        );

        this.functions.push(classMethodDoc);
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

module.exports = classMethodTraversalMap;
