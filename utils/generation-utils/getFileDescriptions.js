const getDescription = require("../api-utils/getDescription");

const getFileDescriptions = async (obj) => {
  console.log(obj.name);

  if (!obj.description) {
    await getDescription(obj, obj.sourceCode());
  }

  if (!obj.description) {
    // Recursively traverse the components, classes, functions, and variables arrays
    const keys = ["components", "classes", "functions", "variables"];
    for (const key of keys) {
      if (Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          await getFileDescriptions(item);
        }
      }
    }
  }
};

module.exports = getFileDescriptions;
