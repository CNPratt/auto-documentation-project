class FileDocument {
  constructor(filePath, fileSourceCodeHash) {
    this.filePath = filePath;
    this.fileSourceCodeHash = fileSourceCodeHash;
    this.components = [];
    this.classes = [];
    this.functions = [];
    this.variables = [];
    this.imports = [];
    this.exports = [];
  }
}

module.exports = FileDocument;
