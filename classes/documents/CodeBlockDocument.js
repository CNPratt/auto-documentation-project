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

  // Function to find the object with the matching component name in the generated documentationData array
  findComponentDocumentationObject = (previousFileMismatchDocumentation) => {
    let matchingObject = null;

    // Now you can use the documentationData as needed
    matchingObject = previousFileMismatchDocumentation.find((doc) => {
      return doc.sourceCodeHash === this.sourceCodeHash;
    });

    return matchingObject;
  };
}

module.exports = CodeBlockDocument;
