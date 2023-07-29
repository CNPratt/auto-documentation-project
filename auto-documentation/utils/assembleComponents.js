const babelTraverse = require("@babel/traverse");
const createComponentObject = require("./createComponentObject");
const nodeReturnsJsx = require("./nodeReturnsJsx");
const { logWhite, logErrorRed } = require("./chalkUtils");

const assembleComponents = (ast) => {
  const components = [];

  babelTraverse.default(ast, {
    FunctionDeclaration(path) {
      logWhite("Identified function declaration:", path.node.id.name);

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
        logErrorRed(
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
        logWhite(
          "Identified arrow expression:",
          path.node.declarations[0].id.name
        );

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
          logErrorRed(
            "Error parsing arrow function " +
              path.node.declarations[0].id.name +
              ":",
            error.message
          );
        }
      }
    },

    ClassDeclaration(path) {
      logWhite("Identified class declaration:", path.node.id.name);
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
        logErrorRed(
          "Error parsing class declaration " + path.node.id.name + ":",
          error.message
        );
      }
    },
  });

  return components;
};

module.exports = assembleComponents;
