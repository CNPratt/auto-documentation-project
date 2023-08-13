const { logBgYellow, logBgCyan } = require("../console-utils/chalkUtils");
const checkPreviousFileObject = require("./checkPreviousFileObject");

const compareResultWithPreviousDocs = async (
  newFileObject,
  previousFileObject
) => {
  // Log the name property if it exists
  if (newFileObject.name) {
    console.log(newFileObject.name);
  }

  const isPreviousDocValidFormat =
    previousFileObject.hasOwnProperty("classes") &&
    previousFileObject.hasOwnProperty("components") &&
    previousFileObject.hasOwnProperty("functions") &&
    previousFileObject.hasOwnProperty("variables");

  if (isPreviousDocValidFormat) {
    // Recursively traverse the components, classes, functions, and variables arrays
    ["components", "classes", "functions", "variables"].forEach((key) => {
      if (Array.isArray(newFileObject[key])) {
        newFileObject[key].forEach((item) => {
          const foundPreviousObject = checkPreviousFileObject(
            previousFileObject,
            item
          );

          if (foundPreviousObject && !item.description) {
            compareResultWithPreviousDocs(item, previousFileObject);
          } else if (foundPreviousObject && item.description) {
            logBgCyan(
              `Description for ${item.name} imported from previous docs`
            );
          }
        });
      }
    });
  }
};

module.exports = compareResultWithPreviousDocs;
