const babelTypes = require("@babel/types");

const createAstFromComponentNode = (node) => {
  // Create a new AST from the node
  const constructedAst = babelTypes.file(
    babelTypes.program([node], [], "module"),
    [],
    []
  );

  return constructedAst;
};

module.exports = createAstFromComponentNode;
