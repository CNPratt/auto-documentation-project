const getFileDocumentation = require("./getFileDocumentation");
const generateFileData = require("../component-utils/generateFileData");
const { logYellow, logErrorRed } = require("../console-utils/chalkUtils");
const findFileDocumentation = require("./findFileDocumentation");
const babelParser = require("@babel/parser");
const getHash = require("./getHash");
const fs = require("fs");

const config = require("../../config");

const generateMasterDocumentation = async (files) => {
  logYellow("Getting file data");

  // Clear the updated components array
  config.updatedComponents = [];

  const masterDocument = [];

  for (const file of files) {
    if (file.endsWith(".js")) {
      logYellow("Getting data for file:", file);
      try {
        let thisFileData = {
          filePath: file,
          wholeFileSourceCode: "",
          wholeFileSourceCodeHash: "",
          componentObjectsArray: [],
          functionObjectsArray: [],
          variableObjectsArray: [],
          classObjectsArray: [],
          importObjectsArray: [],
          exportObjectsArray: [],
        };

        const sourceCode = await fs.promises.readFile(file, "utf-8");

        // Add source code for reference in future functions
        thisFileData.wholeFileSourceCode = sourceCode;

        // Generate and add whole file source code hash to add on doc objects for change checking
        thisFileData.wholeFileSourceCodeHash = getHash(sourceCode);

        // Generate an AST from the source code
        const ast = babelParser.parse(sourceCode, {
          sourceType: "module",
          plugins: ["jsx"],
        });

        // Log the AST to the console
        // logAst(ast);

        const matchedFileDocumentationObject = findFileDocumentation(
          file,
          thisFileData.wholeFileSourceCodeHash
        );

        if (!matchedFileDocumentationObject) {
          const generatedFileData = generateFileData(ast);

          thisFileData.componentObjectsArray =
            generatedFileData.componentsArray;
          thisFileData.importObjectsArray = generatedFileData.importsArray;
          thisFileData.exportObjectsArray = generatedFileData.exportsArray;
          thisFileData.functionObjectsArray =
            generatedFileData.globalFunctionsArray;
          thisFileData.variableObjectsArray =
            generatedFileData.globalVariablesArray;
          thisFileData.classObjectsArray = generatedFileData.globalClassesArray;
        } else {
          thisFileData = { ...thisFileData, ...matchedFileDocumentationObject };
        }

        await getFileDocumentation(thisFileData, masterDocument);
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
