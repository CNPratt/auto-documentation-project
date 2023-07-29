const babelTraverse = require("@babel/traverse");
const babelTypes = require("@babel/types");

const nodeReturnsJsx = (node) => {
  let hasJSX = false;
  babelTraverse.default(node, {
    enter(path) {
      if (babelTypes.isJSX(path.node)) {
        hasJSX = true;
        path.stop();
      }
    },
    noScope: true,
  });

  return hasJSX;
};

module.exports = nodeReturnsJsx;
