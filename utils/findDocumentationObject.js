const fs = require("fs");
const path = require("path");

// Function to find the object with the matching component name in the generated documentationData array
const findDocumentationObject = (componentName) => {
  // Relative path to the generated documentation file used to require it if it exists
  const filePath = "../generated-documentation/generated-documentation.js";

  // Absolute path to the generated documentation file used to find the matching object if it exists
  const documentationFilePath = path.join(__dirname, filePath);

  let matchingObject = null;

  // Check if the file exists
  if (fs.existsSync(documentationFilePath)) {
    // The file exists, so you can require it
    const documentationData = require(filePath);

    // Now you can use the documentationData as needed
    matchingObject = documentationData.find(
      (doc) => doc.component === componentName
    );
  } else {
    console.log("File does not exist:", filePath);
    // Handle the case when the file doesn't exist
  }

  return matchingObject;
};

module.exports = findDocumentationObject;
