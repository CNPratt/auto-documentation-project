class FileData {
  constructor(filePath) {
    this.filePath = filePath;
    this.wholeFileSourceCode = "";
    this.wholeFileSourceCodeHash = "";
    this.globalFunctionsArray = [];
    this.globalVariablesArray = [];
    this.globalClassesArray = [];
    this.componentsArray = [];
    this.importsArray = [];
    this.exportsArray = [];
  }
}

module.exports = FileData;
