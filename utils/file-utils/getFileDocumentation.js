const parseComponentObjects = require("../component-utils/parseComponentObjects");
const findFileDocumentation = require("./findFileDocumentation");
const FileDocument = require("../../classes/documents/FileDocument");
const chalkUtils = require("../console-utils/chalkUtils");
const config = require("../../config");
const logErrorRed = chalkUtils.logErrorRed;

const getFileDocumentation = async (fileDataObject, masterDocument) => {
  const fileDocumentation = new FileDocument(
    fileDataObject.filePath,
    fileDataObject.wholeFileSourceCodeHash
  );

  fileDocumentation.imports = fileDataObject.importObjectsArray;
  fileDocumentation.exports = fileDataObject.exportObjectsArray;
  fileDocumentation.functions = fileDataObject.functionObjectsArray;
  fileDocumentation.variables = fileDataObject.variableObjectsArray;
  fileDocumentation.classes = fileDataObject.classObjectsArray;

  // Fetch the previously generated documentation object for this file if it exists
  const matchedFileDocumentationObject = findFileDocumentation(
    fileDataObject.filePath,
    fileDataObject.wholeFileSourceCodeHash
  );

  // If a matching object was found and the encoded source code matches the encoded source code
  // Just return the previous documentation object early instead of parsing it again
  if (!matchedFileDocumentationObject) {
    // Parse the documentation for each component in the file
    for (const componentObject of fileDataObject.componentObjectsArray) {
      try {
        const componentDocToAdd = await parseComponentObjects(
          componentObject,
          matchedFileDocumentationObject
        );

        fileDocumentation.components.push(componentDocToAdd);

        // console.log(parsedDocumentation);
        // masterDocument.push(fileDocumentation);
      } catch (error) {
        logErrorRed(
          `Error parsing documentation for ${componentObject.name}. Error: ${error.message}`
        );
      }
    }
    if (!fileDataObject.componentObjectsArray.length) {
      config.updatedOtherFiles.push(fileDocumentation.filePath);
    }

    masterDocument.push(fileDocumentation);
  } else {
    masterDocument.push(matchedFileDocumentationObject);
  }
};

module.exports = getFileDocumentation;
