const getHash = require("../../utils/file-utils/getHash");
const babelTraverse = require("@babel/traverse");
const babelParser = require("@babel/parser");
const fileFunctionTraversalMap = require("../../utils/data-utils/traversal-maps/file-maps/fileFunctionTraversalMap");
const fileClassTraversalMap = require("../../utils/data-utils/traversal-maps/file-maps/fileClassTraversalMap");
const fileVariableTraversalMap = require("../../utils/data-utils/traversal-maps/file-maps/fileVariableTraversalMap");

class CodeBlockDocument {
  constructor(name, sourceCode) {
    this.name = name;
    this.variables = [];
    this.functions = [];
    this.components = [];
    this.description = "";
    this.sourceCodeHash = getHash(sourceCode);
    // temp
    this.isBlock = true;

    // this.initializeComponentDocument(sourceCode);
  }

  initializeComponentDocument = async (sourceCode) => {
    // Generate an AST from the source code
    const ast = babelParser.parse(sourceCode, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    // combine all traversal maps into one with object
    const componentTraversalMap = Object.assign(
      {},
      fileFunctionTraversalMap(CodeBlockDocument),
      fileClassTraversalMap(CodeBlockDocument),
      fileVariableTraversalMap(CodeBlockDocument)
    );

    // Traverse the AST and populate the file data by calling the functions in the traversal map
    // This object is passed as the fourth argument to the traverse function so
    // that the functions in the traversal map can access the FileDocument object
    babelTraverse.default(ast, componentTraversalMap, null, this);
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
