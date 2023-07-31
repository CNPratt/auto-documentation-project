const getFileDocumentation = require("./getFileDocumentation");
const assembleComponents = require("../component-utils/assembleComponents");
const { logYellow, logErrorRed } = require("../console-utils/chalkUtils");
const babelParser = require("@babel/parser");
const fs = require("fs");

const config = require("../../config");

const generateMasterDocumentation = async (files) => {
  logYellow("Getting documentation");

  // Clear the updated components array
  config.updatedComponents = [];

  const masterDocument = [];

  for (const file of files) {
    if (file.endsWith(".js")) {
      logYellow("Getting documentation for file:", file);
      try {
        const sourceCode = await fs.promises.readFile(file, "utf-8");

        // Generate an AST from the source code
        const ast = babelParser.parse(sourceCode, {
          sourceType: "module",
          plugins: ["jsx"],
        });

        // Log the AST to the console
        // logAst(ast);

        const fileComponentObjects = assembleComponents(ast);

        await getFileDocumentation(fileComponentObjects, masterDocument);
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
