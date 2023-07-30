const parseComponentObjects = require("./parseComponentObjects");
const chalkUtils = require("./chalkUtils");
const logErrorRed = chalkUtils.logErrorRed;

const getFileDocumentation = async (fileComponentObjects, masterDocument) => {
  // Parse the documentation for each component in the file
  for (const componentObject of fileComponentObjects) {
    try {
      const parsedDocumentation = await parseComponentObjects(componentObject);

      // console.log(parsedDocumentation);
      masterDocument.push(parsedDocumentation);
    } catch (error) {
      logErrorRed(
        `Error parsing documentation for ${componentObject.name}. Error: ${error.message}`
      );
    }
  }
};

module.exports = getFileDocumentation;
