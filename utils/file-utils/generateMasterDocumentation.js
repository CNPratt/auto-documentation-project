const { logYellow, logErrorRed } = require("../console-utils/chalkUtils");
const fs = require("fs");
const parser = require("@babel/parser");

const config = require("../../config");
const analyzeFile = require("../../traversal-maps/codeblock-maps/test-option");

const generateMasterDocumentation = async (files) => {
  logYellow("Getting file data");

  // Clear the updated components array
  config.updatedComponents = [];
  config.updatedFiles = [];

  const masterDocument = [];

  for (const file of files) {
    if (file.endsWith(".js") && file.includes("App.js")) {
      logYellow("Getting data for file:", file);

      try {
        // const fileDocumentation = new FileDocument(file);

        // await fileDocumentation.initializeFileData();

        const code = fs.readFileSync(file, "utf-8");
        const ast = parser.parse(code, {
          sourceType: "module",
          plugins: ["jsx"], // Include if you are using JSX
        });

        const fileDocumentation = analyzeFile(ast, code);

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
