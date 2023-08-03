class ComponentDocument {
  constructor(name, sourceCodeHash) {
    this.name = name;
    this.variables = [];
    this.functions = [];
    this.description = "";
    this.sourceCodeHash = sourceCodeHash;
  }
}

module.exports = ComponentDocument;
