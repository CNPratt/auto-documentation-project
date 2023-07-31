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

  // Convert the documentation object to a string representation
  const jsCode = `module.exports = ${util.inspect(documentation, {
    depth: null,
  })};`;

  // Create a Buffer from the JavaScript code
  const buffer = Buffer.from(jsCode);

  // Make sure the error is logged if there is one writing the file
  try {
    if (config.updatedComponents.length > 0) {
      // Write the buffer to the documentation.js file
      fs.writeFileSync(documentationFilePath, buffer);

      logGreen("Documentation successfully generated and saved!");
      logNativeGreen("Updated components:", config.updatedComponents);
    } else {
      logGreen(
        "No components updated. Previous documentation remains unchanged."
      );
    }
  } catch (e) {
    logErrorBgRed("Error writing documentation file:", e);
  }
};

module.exports = getDocumentation;
