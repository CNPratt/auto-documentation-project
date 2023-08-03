const config = require("../../config");
const ComponentDocument = require("./ComponentDocument");
const findFileDocumentation = require("../../utils/file-utils/findFileDocumentation");
const { logErrorRed } = require("../../utils/console-utils/chalkUtils");
const findComponentDocumentationObject = require("../../utils/file-utils/findComponentDocumentationObject");

class FileDocument {
  constructor(fileData) {
    this.filePath = fileData.filePath;
    this.name = fileData.filePath.split("/").pop();
    this.sourceCodeHash = fileData.sourceCodeHash;
    this.components = [];
    this.classes = [];
    this.functions = [];
    this.variables = [];
    this.imports = fileData.imports || [];
    this.exports = fileData.exports || [];
  }

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

  getComponentDescriptions = async (componentsData) => {
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
          const newComponentDoc = new ComponentDocument(
            componentObject.name,
            componentObject.code
          );

          // Get the description from the OpenAI API
          await getDescription(newC, componentObject.code);

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
