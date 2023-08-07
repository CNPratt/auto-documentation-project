const createAstFromNodeFragment = require("./createAstFromNodeFragment");
const generator = require("@babel/generator").default;

const getCodeFromNode = (node) => {
  // Since we are receiving partial ASTs, we need to construct a full AST for each component
  // const constructedAst = createAstFromNodeFragment(node);

  // Generate the code from the new AST
  return generator(node).code;
};

module.exports = getCodeFromNode;
