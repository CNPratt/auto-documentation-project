const t = require("@babel/types");
const createAstFromNodeFragment = require("../../utils/ast-utils/createAstFromNodeFragment");
const generator = require("@babel/generator").default;
const { logMagenta, logCyan } = require("../../utils/console-utils/chalkUtils");

const classMethodTraversalMap = (type, handleInnerCode) => {
  return {
    ClassMethod(path) {
      // parent name
      // console.log("parent name", path.parentPath.node.key);
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

      const classMethodDoc = new type(path.node.key.name, generator(ast).code);

      logCyan(`Found class method:`, path.node.key.name);

      if (this.name === this.bindingKeys[0]) {
        logMagenta(
          `Adding ${path.node.key.name} to ${this.name} class functions`
        );

        this.functions.push(classMethodDoc);
      }

      // handleInnerCode(path, this);
    },
  };
};

module.exports = classMethodTraversalMap;
