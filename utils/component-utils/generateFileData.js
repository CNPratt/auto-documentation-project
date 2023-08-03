const babelTraverse = require("@babel/traverse");
const functionTraversalMap = require("../data-utils/traversal-maps/functionTraversalMap");
const classTraversalMap = require("../data-utils/traversal-maps/classTraversalMap");
const variableTraversalMap = require("../data-utils/traversal-maps/variableTraversalMap");
const importTraversalMap = require("../data-utils/traversal-maps/importTraversalMap");

const generateFileData = (ast, fileData) => {
  // combine all traversal maps into one with object
  const fileTraversalMap = Object.assign(
    {},
    functionTraversalMap,
    classTraversalMap,
    variableTraversalMap,
    importTraversalMap
  );
  babelTraverse.default(ast, fileTraversalMap, null, fileData);

  return fileData;
};

module.exports = generateFileData;
