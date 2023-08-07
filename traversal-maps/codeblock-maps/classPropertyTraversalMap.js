const t = require("@babel/types");
const createAstFromNodeFragment = require("../../utils/ast-utils/createAstFromNodeFragment");
const generator = require("@babel/generator").default;
const { logMagenta, logCyan } = require("../../utils/console-utils/chalkUtils");
const nodeReturnsJsx = require("../../utils/ast-utils/nodeReturnsJsx");

const classPropertyTraversalMap = (type, handleInnerCode) => {
  return {
    ClassProperty(path) {
      // parent name
      // console.log("parent name", path.parentPath.node.key.name);
      console.log("path.parentPath.type", path.parentPath.type);
      console.log("this.isBlock", this.isBlock);
      console.log("this.bindingKeys", this.bindingKeys);

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

      logCyan(`Found class property:`, path.node.key.name);

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
      }

      // handleInnerCode(path, this);
    },
  };
};

module.exports = classPropertyTraversalMap;
