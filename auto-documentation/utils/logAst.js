const util = require("util");

const logAst = (ast) =>
  console.log(util.inspect(ast, { showHidden: false, depth: null }));

module.exports = logAst;
