const checkPreviousFileObject = require("./checkPreviousFileObject");

const compareResultWithPreviousDocs = (newFileObject, previousFileObject) => {
  // Log the name property if it exists
  if (newFileObject.name) {
    console.log(newFileObject.name);
  }

  // Recursively traverse the components, classes, functions, and variables arrays
  ["components", "classes", "functions", "variables"].forEach((key) => {
    if (Array.isArray(newFileObject[key])) {
      newFileObject[key].forEach((item) => {
        const foundPreviousObject = checkPreviousFileObject(
          previousFileObject,
          item
        );

        if (foundPreviousObject) {
          compareResultWithPreviousDocs(item, previousFileObject);
        }
      });
    }
  });
};

module.exports = compareResultWithPreviousDocs;
