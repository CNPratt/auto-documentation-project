const babelTraverse = require("@babel/traverse");
const componentExtractionMap = require("../data-utils/traversal-maps/componentExtractionMap");
const importExtractionMap = require("../data-utils/traversal-maps/importExtractionMap");

const generateFileData = (ast) => {
  const fileData = {
    globalFunctionsArray: [],
    globalVariablesArray: [],
    globalClassesArray: [],
    componentsArray: [],
    importsArray: [],
    exportsArray: [],
  };

  // Do separate traversals to get different file information
  // This may be technically inefficient, but it's easier to read and maintain
  babelTraverse.default(ast, componentExtractionMap, null, fileData);
  babelTraverse.default(ast, importExtractionMap, null, fileData);

  return fileData;
};

module.exports = generateFileData;
