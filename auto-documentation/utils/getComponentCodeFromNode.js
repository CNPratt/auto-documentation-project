const createAstFromComponentNode = require("./createAstFromComponentNode");
const generator = require("@babel/generator").default;

const getComponentCodeFromNode = (node) => {
  // Since we are receiving partial ASTs, we need to construct a full AST for each component
  const constructedAst = createAstFromComponentNode(node);

  // Generate the code from the new AST
  return generator(constructedAst).code;
};

module.exports = getComponentCodeFromNode;
