const babelTypes = require("@babel/types");

const createAstFromNodeFragment = (node) => {
  // Create a new AST from the node
  const constructedAst = babelTypes.file(
    babelTypes.program([node], [], "module"),
    [],
    []
  );

  return constructedAst;
};

module.exports = createAstFromNodeFragment;
