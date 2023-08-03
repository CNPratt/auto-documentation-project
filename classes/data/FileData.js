const getHash = require("../../utils/file-utils/getHash");
const { logErrorRed } = require("../../utils/console-utils/chalkUtils");
const babelTraverse = require("@babel/traverse");
const functionTraversalMap = require("../../utils/data-utils/traversal-maps/functionTraversalMap");
const classTraversalMap = require("../../utils/data-utils/traversal-maps/classTraversalMap");
const variableTraversalMap = require("../../utils/data-utils/traversal-maps/variableTraversalMap");
const importTraversalMap = require("../../utils/data-utils/traversal-maps/importTraversalMap");
const babelParser = require("@babel/parser");
const fs = require("fs");

class FileData {
  constructor(filePath) {
    this.filePath = filePath;
    this.ast = null;
    this.code = "";
    this.sourceCodeHash = "";
    this.functions = [];
    this.variables = [];
    this.classes = [];
    this.components = [];
    this.imports = [];
    this.exports = [];
  }

  initializeFileData = async () => {
    try {
      this.code = await fs.promises.readFile(this.filePath, "utf-8");
      this.sourceCodeHash = getHash(this.code);

      // Generate an AST from the source code
      this.ast = babelParser.parse(this.code, {
        sourceType: "module",
        plugins: ["jsx"],
      });
    } catch (error) {
      logErrorRed(
        `Error initializing file data for ${filePath}. Error: ${error.message}`
      );
    }
  };

  generateFileData = async () => {
    // combine all traversal maps into one with object
    const fileTraversalMap = Object.assign(
      {},
      functionTraversalMap,
      classTraversalMap,
      variableTraversalMap,
      importTraversalMap
    );
    babelTraverse.default(this.ast, fileTraversalMap, null, this);
  };
}

module.exports = FileData;
