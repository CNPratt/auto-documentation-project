const getHash = require("../../utils/file-utils/getHash");
const babelTraverse = require("@babel/traverse");
const babelParser = require("@babel/parser");
const innerCodeTraversalMap = require("../../traversal-maps/codeblock-maps/innerCodeExtractionTraversalMap");
const { logGreen, logYellow } = require("../../utils/console-utils/chalkUtils");

class CodeBlockDocument {
  constructor(name, sourceCode) {
    this.name = name;
    this.variables = [];
    this.functions = [];
    this.components = [];
    this.classes = [];
    this.description = "";
    this.sourceCodeHash = getHash(sourceCode);
    // temp
    this.isBlock = true;
    this.initializeComponentDocument(sourceCode);
  }

  initializeComponentDocument = async (sourceCode) => {
    logYellow("Initializing component document for " + this.name);
    // Generate an AST from the source code
    const ast = babelParser.parse(sourceCode, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    // Traverse the AST and populate the file data by calling the functions in the traversal map
    // This object is passed as the fourth argument to the traverse function so
    // that the functions in the traversal map can access the FileDocument object
    babelTraverse.default(
      ast,
      innerCodeTraversalMap(CodeBlockDocument, this.name),
      null,
      this
    );

    logGreen("Finished initializing component document for " + this.name);
  };

  // Function to find the object with the matching component name in the generated documentationData array
  findComponentDocumentationObject = (previousFileMismatchDocumentation) => {
    let matchingObject = null;

    if (previousFileMismatchDocumentation) {
      // Now you can use the documentationData as needed
      matchingObject = previousFileMismatchDocumentation.components.find(
        (doc) => {
          return doc.sourceCodeHash === this.sourceCodeHash;
        }
      );
    }

    return matchingObject;
  };
}

module.exports = CodeBlockDocument;
