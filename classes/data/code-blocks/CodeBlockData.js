const getCodeFromNode = require("../../../utils/ast-utils/getCodeFromNode");

class CodeBlockData {
  constructor(name, node) {
    this.name = name;
    this.code = getCodeFromNode(node);
    this.components = [];
    this.classes = [];
    this.functions = [];
    this.variables = [];
  }
}

module.exports = CodeBlockData;
