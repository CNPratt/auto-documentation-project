const getHash = require("../../utils/file-utils/getHash");
const babelTraverse = require("@babel/traverse");
const babelParser = require("@babel/parser");
const innerCodeTraversalMap = require("../../traversal-maps/codeblock-maps/innerCodeExtractionTraversalMap");
const { logGreen, logYellow } = require("../../utils/console-utils/chalkUtils");
const { logErrorRed } = require("../../utils/console-utils/chalkUtils");
const getDescription = require("../../utils/api-utils/getDescription");
const config = require("../../config");

class CodeBlockDocument {
  constructor(name, sourceCode) {
    this.name = name;
    this.variables = [];
    this.functions = [];
    this.classes = [];
    this.components = [];
    this.classes = [];
    this.description = "";
    this.sourceCodeHash = getHash(sourceCode);
    // temp
    this.isBlock = true;
    this.getSourceCode = () => sourceCode;
    this.getParentDocumentArray = () => [];

    this.initializeCodeBlockDocument(sourceCode);
  }

  initializeCodeBlockDocument = async (sourceCode) => {
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
  findCodeBlockDocumentationObject = (previousFileMismatchDocumentation) => {
    let matchingObject = null;

    if (previousFileMismatchDocumentation) {
      const codeBlockArraysArray = [
        previousFileMismatchDocumentation.components,
        previousFileMismatchDocumentation.classes,
        previousFileMismatchDocumentation.functions,
        previousFileMismatchDocumentation.variables,
      ];

      // Now you can use the documentationData as needed
      for (const codeBlocksArray of codeBlockArraysArray) {
        matchingObject = codeBlocksArray.find((doc) => {
          return doc.sourceCodeHash === this.sourceCodeHash;
        });

        if (matchingObject) {
          this.getParentDocumentArray = () => codeBlocksArray;
          break;
        }
      }
      // matchingObject = previousFileMismatchDocumentation.components.find(
      //   (doc) => {
      //     return doc.sourceCodeHash === this.sourceCodeHash;
      //   }
      // );
    }

    return matchingObject;
  };

  getCodeBlockDescriptions = async (previousFileMismatchDocumentation) => {
    try {
      const code = this.getSourceCode();

      // Check if there is already a component documentation object for this component
      let matchedCodeBlockDocumentationObject = null;

      matchedCodeBlockDocumentationObject =
        await this.findCodeBlockDocumentationObject(
          previousFileMismatchDocumentation
        );

      // If there is a matched component documentation object, push it instead of generating a new one
      if (matchedCodeBlockDocumentationObject) {
        Object.assign(this, matchedCodeBlockDocumentationObject);
      } else {
        // Get the description from the OpenAI API
        await getDescription(this, code);

        config.updatedComponents.push(this.name);

        if (!this.description) {
          await this.getChildrenDescriptions(this.getParentDocumentArray());
        }
      }
    } catch (error) {
      logErrorRed(
        `Error parsing documentation for ${this.name}. Error: ${error.message}`
      );
    }
  };

  getChildrenDescriptions = async () => {
    const codeBlockArraysArray = [
      this.components,
      this.classes,
      this.functions,
      this.variables,
    ];

    // Parse the documentation for each code block in the file
    for (const codeBlocksArray of codeBlockArraysArray) {
      for (const codeBlockDocument of codeBlocksArray) {
        await codeBlockDocument.getCodeBlockDescriptions(
          this.previousFileMismatchDocumentation
        );
      }
    }
  };
}

module.exports = CodeBlockDocument;
