const getHash = require("../../utils/file-utils/getHash");

class ComponentDocument {
  constructor(name, sourceCode) {
    this.name = name;
    this.variables = [];
    this.functions = [];
    this.description = "";
    this.sourceCodeHash = getHash(sourceCode);
  }
}

module.exports = ComponentDocument;
