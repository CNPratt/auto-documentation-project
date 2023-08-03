const config = require("../../config");
const CodeBlockDocument = require("./CodeBlockDocument");
const findFileDocumentation = require("../../utils/file-utils/findFileDocumentation");
const { logErrorRed } = require("../../utils/console-utils/chalkUtils");
const findComponentDocumentationObject = require("../../utils/file-utils/findComponentDocumentationObject");
const fs = require("fs");
const getHash = require("../../utils/file-utils/getHash");
const babelTraverse = require("@babel/traverse");
const functionTraversalMap = require("../../utils/data-utils/traversal-maps/functionTraversalMap");
const classTraversalMap = require("../../utils/data-utils/traversal-maps/classTraversalMap");
const variableTraversalMap = require("../../utils/data-utils/traversal-maps/variableTraversalMap");
const importTraversalMap = require("../../utils/data-utils/traversal-maps/importTraversalMap");
const babelParser = require("@babel/parser");
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
  }

  initializeFileData = async () => {
    try {
      const sourceCode = await fs.promises.readFile(this.filePath, "utf-8");
      this.sourceCodeHash = getHash(sourceCode);

      // Generate an AST from the source code
      const ast = babelParser.parse(sourceCode, {
        sourceType: "module",
        plugins: ["jsx"],
      });

      // combine all traversal maps into one with object
      const fileTraversalMap = Object.assign(
        {},
        functionTraversalMap,
        classTraversalMap,
        variableTraversalMap,
        importTraversalMap
      );

      // Traverse the AST and populate the file data by calling the functions in the traversal map
      // This object is passed as the fourth argument to the traverse function so
      // that the functions in the traversal map can access the FileDocument object
      babelTraverse.default(ast, fileTraversalMap, null, this);
    } catch (error) {
      logErrorRed(
        `Error initializing file data for ${filePath}. Error: ${error.message}`
      );
    }
  };

  initializeFileDocument = async (componentsData) => {
    const matchingFileDocumentationObject = this.findMatchingFileDocs();

    if (matchingFileDocumentationObject) {
      Object.assign(this, matchingFileDocumentationObject);
    } else {
      config.updatedFiles.push(this.filePath);
      await this.getComponentDescriptions(componentsData);
    }
  };

  findMatchingFileDocs = () => {
    return findFileDocumentation(this.filePath, this.sourceCodeHash);
  };

  getComponentDescriptions = async () => {
    // Create new variable to save the component data before we clear it to make way for the component documentation
    const componentsData = [...this.components];
    this.components = [];

    // Parse the documentation for each component in the file
    for (const componentObject of componentsData) {
      try {
        // Check if there is already a component documentation object for this component
        const matchedComponentDocumentationObject =
          findComponentDocumentationObject(componentObject, this.components);

        // If there is a matched component documentation object, push it instead of generating a new one
        if (matchedComponentDocumentationObject) {
          this.components.push(matchedComponentDocumentationObject);
        } else {
          // Generate a new component documentation object since there is none or there have been changes
          const newComponentDoc = new CodeBlockDocument(
            componentObject.name,
            componentObject.code
          );

          // Get the description from the OpenAI API
          await getDescription(newComponentDoc, componentObject.code);

          this.components.push(newComponentDoc);

          config.updatedComponents.push(componentObject.name);
        }
      } catch (error) {
        logErrorRed(
          `Error parsing documentation for ${componentObject.name}. Error: ${error.message}`
        );
      }
    }
  };
}

module.exports = FileDocument;
