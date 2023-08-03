const CodeBlock = require("./CodeBlock");

class VariableData extends CodeBlock {
  constructor(name, node) {
    super(name, node);
  }
}

module.exports = VariableData;
