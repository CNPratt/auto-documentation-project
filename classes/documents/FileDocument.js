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
const getDescription = require("../../utils/api-utils/getDescription");
const path = require("path");
const fileFunctionTraversalMap = require("../../traversal-maps/file-maps/fileFunctionTraversalMap");
const fileClassTraversalMap = require("../../traversal-maps/file-maps/fileClassTraversalMap");
const fileVariableTraversalMap = require("../../traversal-maps/file-maps/fileVariableTraversalMap");
const importTraversalMap = require("../../traversal-maps/file-maps/importTraversalMap");

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
  }

  initializeFileData = async () => {
    try {
      const sourceCode = await fs.promises.readFile(this.filePath, "utf-8");
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
        } else {
          logBlue("Source code mismatch found for " + this.filePath);
          this.previousFileMismatchDocumentation =
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
    await this.getComponentDescriptions(this.components);
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

  getComponentDescriptions = async () => {
    // Parse the documentation for each component in the file
    for (const componentDocument of this.components) {
      try {
        // Check if there is already a component documentation object for this component
        let matchedComponentDocumentationObject = null;

        matchedComponentDocumentationObject =
          await componentDocument.findComponentDocumentationObject(
            this.previousFileMismatchDocumentation
          );

        // If there is a matched component documentation object, push it instead of generating a new one
        if (matchedComponentDocumentationObject) {
          Object.assign(componentDocument, matchedComponentDocumentationObject);
        } else {
          // Get the description from the OpenAI API
          await getDescription(componentDocument, componentDocument.code);

          config.updatedComponents.push(componentDocument.name);
        }
      } catch (error) {
        logErrorRed(
          `Error parsing documentation for ${componentDocument.name}. Error: ${error.message}`
        );
      }
    }
  };
}

module.exports = FileDocument;
