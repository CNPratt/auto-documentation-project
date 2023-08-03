const { logYellow, logErrorRed } = require("../console-utils/chalkUtils");
const FileDocument = require("../../classes/documents/FileDocument");

const config = require("../../config");
const FileData = require("../../classes/data/FileData");

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
        let thisFileData = new FileData(file);

        await thisFileData.initializeFileData();

        await thisFileData.generateFileData();

        const fileDocumentation = new FileDocument(thisFileData);
        await fileDocumentation.initializeFileDocument(thisFileData.components);

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
