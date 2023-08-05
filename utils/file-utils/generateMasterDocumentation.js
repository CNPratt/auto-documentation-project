const { logYellow, logErrorRed } = require("../console-utils/chalkUtils");
const FileDocument = require("../../classes/documents/FileDocument");

const config = require("../../config");

const generateMasterDocumentation = async (files) => {
  logYellow("Getting file data");

  // Clear the updated components array
  config.updatedComponents = [];
  config.updatedFiles = [];

  const masterDocument = [];

  for (const file of files) {
    if (file.endsWith(".js")) {
      logYellow("Getting data for file:", file);

      try {
        const fileDocumentation = new FileDocument(file);

        await fileDocumentation.initializeFileData();
        // await fileDocumentation.initializeFileDocument();

        masterDocument.push(fileDocumentation);
      } catch (error) {
        logErrorRed(
          `Error reading or parsing ${file}. Error: ${error.message}`
        );
      }
    }
  }
  return masterDocument;
};

module.exports = generateMasterDocumentation;
