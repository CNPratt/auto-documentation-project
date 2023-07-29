const getFiles = require("./utils/getFiles");
const getDocumentation = require("./utils/getDocumentation");

const config = require("./config");

const fs = require("fs");
const path = require("path");
const https = require("https");
const util = require("util");
const readline = require("readline");

const generateDocumentation = async () => {
  console.log("Generating documentation");
  const files = await getFiles(
    path.join(__dirname, config.relativeDirectoryConnector)
  );
  const documentation = await getDocumentation(files);

  const documentationFilePath = path.join(
    __dirname,
    "/generated-documentation/generated-documentation.js"
  );

  // Convert the documentation object to a string representation
  const jsCode = `module.exports = ${util.inspect(documentation, {
    depth: null,
  })};`;

  // Create a Buffer from the JavaScript code
  const buffer = Buffer.from(jsCode);

  // Write the buffer to the documentation.js file
  fs.writeFileSync(documentationFilePath, buffer);

  console.log("Documentation generated");
  console.log("Updated components:", config.updatedComponents);
};

generateDocumentation();
