const config = require("../../config");
const CodeBlockDocument = require("./CodeBlockDocument");
const {
  logErrorRed,
  logGreen,
  logBlue,
  logCyan,
} = require("../../utils/console-utils/chalkUtils");
const fs = require("fs");
const getHash = require("../../utils/file-utils/getHash");
const babelTraverse = require("@babel/traverse");
const babelParser = require("@babel/parser");
const path = require("path");
const fileFunctionTraversalMap = require("../../traversal-maps/file-maps/fileFunctionTraversalMap");
const fileClassTraversalMap = require("../../traversal-maps/file-maps/fileClassTraversalMap");
const fileVariableTraversalMap = require("../../traversal-maps/file-maps/fileVariableTraversalMap");
const importTraversalMap = require("../../traversal-maps/file-maps/importTraversalMap");
const getDescription = require("../../utils/api-utils/getDescription");

class FileDocument {
  constructor(filePath) {
    this.filePath = filePath;
    this.name = filePath.split("/").pop();
    this.sourceCodeHash = "";
    this.components = [];
    this.classes = [];
    this.functions = [];
    this.variables = [];
    this.imports = [];
    this.exports = [];
    this.previousFileMismatchDocumentation = null;
    // temp
    this.getSourceCode = null;
    this.hasExactMatch = () => false;
  }

  initializeFileData = async () => {
    try {
      const sourceCode = await fs.promises.readFile(this.filePath, "utf-8");

      this.getSourceCode = () => sourceCode;
      this.sourceCodeHash = getHash(sourceCode);

      const matchingFilePathDocumentationObject =
        await this.findMatchingFileDocs();

      if (matchingFilePathDocumentationObject) {
        if (
          matchingFilePathDocumentationObject.sourceCodeHash ===
          this.sourceCodeHash
        ) {
          logGreen("Exact match found for " + this.filePath);
          Object.assign(this, matchingFilePathDocumentationObject);
          this.hasExactMatch = () => true;
        } else {
          logBlue("Source code mismatch found for " + this.filePath);
          this.getPreviousFileMismatchDocumentation = () =>
            matchingFilePathDocumentationObject;
          await this.initializeFileDocument(sourceCode);
        }
      } else {
        logCyan("No match found for " + this.filePath);
        await this.initializeFileDocument(sourceCode);
      }
    } catch (error) {
      logErrorRed(
        `Error initializing file data for ${this.filePath}. Error: ${error.message}`
      );
    }
  };

  initializeFileDocument = async (sourceCode) => {
    console.log("Initializing file document for " + this.filePath);

    sourceCode = sourceCode.replaceAll(
      "super(",
      "constructorSuperPlaceholder("
    );
    // Generate an AST from the source code
    const ast = babelParser.parse(sourceCode, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    // combine all traversal maps into one with object
    const fileTraversalMap = Object.assign(
      {},
      fileFunctionTraversalMap(CodeBlockDocument),
      fileClassTraversalMap(CodeBlockDocument),
      fileVariableTraversalMap(CodeBlockDocument),
      importTraversalMap
    );

    // Traverse the AST and populate the file data by calling the functions in the traversal map
    // This object is passed as the fourth argument to the traverse function so
    // that the functions in the traversal map can access the FileDocument object
    babelTraverse.default(ast, fileTraversalMap, null, this);

    config.updatedFiles.push(this.filePath);
    await this.getFileDescription();
  };

  findMatchingFileDocs = () => {
    // Relative path to the generated documentation file used to require it if it exists
    const relativeDocsFilePath =
      "../../generated-documentation/generated-documentation.js";

    // Absolute path to the generated documentation file used to find the matching object if it exists
    const documentationFilePath = path.join(__dirname, relativeDocsFilePath);

    let matchingObject = null;

    // Check if the file exists
    if (fs.existsSync(documentationFilePath)) {
      // The file exists, so you can require it
      const documentationData = require(relativeDocsFilePath);

      // Now you can use the documentationData as needed
      matchingObject = documentationData.find((doc) => {
        return doc.filePath === this.filePath;
      });
    }

    if (matchingObject) {
    } else {
      logGreen("No matching object found for " + this.filePath);
    }

    return matchingObject;
  };

  getFileDescription = async () => {
    try {
      const code = this.getSourceCode();

      // If there is a matched component documentation object, push it instead of generating a new one
      if (!this.hasExactMatch()) {
        // Get the description from the OpenAI API
        await getDescription(this, code);

        config.updatedComponents.push(this.name);

        if (!this.description) {
          await this.getChildrenDescriptions();
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

module.exports = FileDocument;
