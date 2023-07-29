const babelTraverse = require("@babel/traverse");
const createComponentObject = require("./createComponentObject");
const nodeReturnsJsx = require("./nodeReturnsJsx");

const assembleComponents = (ast) => {
  const components = [];

  babelTraverse.default(ast, {
    FunctionDeclaration(path) {
      console.log("Function declaration:" + path.node.id.name);

      try {
        const hasJSX = nodeReturnsJsx(path.node);

        if (hasJSX) {
          const componentObject = createComponentObject(
            path.node.id.name,
            node
          );
          components.push(componentObject);
        }
      } catch (error) {
        console.error(
          "Error parsing function " + path.node.id.name + ":",
          error.message
        );
      }
    },

    VariableDeclaration(path) {
      if (
        path.node.declarations[0].init &&
        path.node.declarations[0].init.type === "ArrowFunctionExpression"
      ) {
        console.log("Arrow expression:" + path.node.declarations[0].id.name);

        try {
          const hasJSX = nodeReturnsJsx(path.node.declarations[0].init);

          if (hasJSX) {
            const componentObject = createComponentObject(
              path.node.declarations[0].id.name,
              node
            );
            components.push(componentObject);
          }
        } catch (error) {
          console.error(
            "Error parsing arrow function " +
              path.node.declarations[0].id.name +
              ":",
            error.message
          );
        }
      }
    },

    ClassDeclaration(path) {
      console.log("Class declaration:" + path.node.id.name);
      const hasJSX = nodeReturnsJsx(path.node);

      try {
        if (hasJSX) {
          const componentObject = createComponentObject(
            path.node.id.name,
            path.node
          );
          components.push(componentObject);
        }
      } catch (error) {
        console.error(
          "Error parsing class declaration " + path.node.id.name + ":",
          error.message
        );
      }
    },
  });

  return components;
};

module.exports = assembleComponents;
