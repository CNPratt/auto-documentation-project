const getHash = require("../../utils/file-utils/getHash");

class CodeBlockDocument {
  constructor(name, sourceCode) {
    this.name = name;
    this.variables = [];
    this.functions = [];
    this.components = [];
    this.description = "";
    this.sourceCodeHash = getHash(sourceCode);
  }
}

module.exports = CodeBlockDocument;
