const getFileDocumentation = require("./getFileDocumentation");
const assembleComponents = require("./assembleComponents");
const babelParser = require("@babel/parser");
const fs = require("fs");

const config = require("../config");

const getDocumentation = async (files) => {
  console.log("Getting documentation");

  // Clear the updated components array
  config.updatedComponents = [];

  const masterDocument = [];

  for (const file of files) {
    console.log(`Getting documentation for ${file}`);
    if (file.endsWith(".js")) {
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
        console.error(
          `Error reading or parsing ${file}. Error: ${error.message}`
        );
      }
    }
  }
  return masterDocument;
};

module.exports = getDocumentation;
