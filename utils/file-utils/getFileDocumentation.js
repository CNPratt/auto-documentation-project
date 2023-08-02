const parseComponentObjects = require("../component-utils/parseComponentObjects");
const findFileDocumentation = require("./findFileDocumentation");
const chalkUtils = require("../console-utils/chalkUtils");
const logErrorRed = chalkUtils.logErrorRed;

const getFileDocumentation = async (fileDataObject, masterDocument) => {
  const fileDocumentation = {
    filePath: fileDataObject.filePath,
    fileSourceCodeHash: fileDataObject.wholeFileSourceCodeHash,
    components: [],
    functions: [],
    variables: [],
    imports: [],
    exports: [],
  };

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
        masterDocument.push(fileDocumentation);
      } catch (error) {
        logErrorRed(
          `Error parsing documentation for ${componentObject.name}. Error: ${error.message}`
        );
      }
    }
  } else {
    masterDocument.push(matchedFileDocumentationObject);
  }
};

module.exports = getFileDocumentation;
