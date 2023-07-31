const babelTraverse = require("@babel/traverse");
const handleNode = require("../ast-utils/handleNode");

const assembleComponents = (ast) => {
  const components = [];

  babelTraverse.default(ast, {
    FunctionDeclaration(path) {
      handleNode("function", path.node.id.name, path.node, components);
    },

    VariableDeclaration(path) {
      if (
        path.node.declarations[0].init &&
        path.node.declarations[0].init.type === "ArrowFunctionExpression"
      ) {
        handleNode(
          "arrow function",
          path.node.declarations[0].id.name,
          path.node,
          components
        );
      }
    },

    ClassDeclaration(path) {
      handleNode("class", path.node.id.name, path.node, components);
    },
  });

  return components;
};

module.exports = assembleComponents;
