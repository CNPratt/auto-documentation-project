const getFiles = require("./getFiles");
const generateMasterDocumentation = require("./generateMasterDocumentation");

const config = require("../../config");

const fs = require("fs");
const path = require("path");
const util = require("util");
const {
  logErrorBgRed,
  logGreen,
  logNativeGreen,
} = require("../console-utils/chalkUtils");

const getDocumentation = async () => {
  console.log("Generating documentation");
  const files = await getFiles(
    path.join(__dirname, config.relativeDirectoryConnector)
  );

  const documentation = await generateMasterDocumentation(files);

  const documentationFilePath = path.join(
    __dirname,
    "../../generated-documentation/generated-documentation.js"
  );

  // Turn the generated documentation into a a JSON string
  const documentationJSON = JSON.stringify(documentation);

  // Convert the documentation object to a string representation
  const jsCode = `module.exports = ${documentationJSON};`;

  // Create a Buffer from the JavaScript code
  const buffer = Buffer.from(jsCode);

  // Make sure the error is logged if there is one writing the file
  try {
    if (config.updatedComponents.length || config.updatedOtherFiles.length) {
      // Write the buffer to the documentation.js file
      fs.writeFileSync(documentationFilePath, buffer);

      logGreen("Documentation successfully generated and saved!");
      logNativeGreen("Updated components:", config.updatedComponents);
      logNativeGreen("Updated other files:", config.updatedOtherFiles);
    } else {
      logGreen("No files updated. Previous documentation remains unchanged.");
    }
  } catch (e) {
    logErrorBgRed("Error writing documentation file:", e);
  }
};

module.exports = getDocumentation;
