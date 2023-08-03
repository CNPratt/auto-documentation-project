const fs = require("fs");
const path = require("path");

// Function to find and return a matching documentation object by file path
const findFileDocumentation = (filePath, fileHash) => {
  // Relative path to the generated documentation file used to require it if it exists
  const relativeDocsFilePath =
    "../../generated-documentation/generated-documentation.js";

  // Absolute path to the generated documentation file used to find the matching object if it exists
  const documentationFilePath = path.join(__dirname, relativeDocsFilePath);

  let matchingObject = null;

  // Check if the file exists
  if (fs.existsSync(documentationFilePath)) {
    // The file exists, so you can require it
    const documentationData = require(relativeDocsFilePath);

    // Now you can use the documentationData as needed
    matchingObject = documentationData.find((doc) => {
      return doc.filePath === filePath && doc.sourceCodeHash === fileHash;
    });
  }

  return matchingObject;
};

module.exports = findFileDocumentation;
