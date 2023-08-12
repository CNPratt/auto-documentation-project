const { logErrorRed } = require("../console-utils/chalkUtils");
const getNodeToExtract = require("./getNodeToExtract");

const getSourceCode = (path, code) => {
  let nodeToExtract = getNodeToExtract(path);

  try {
    // Extract the source code for the node
    const sourceCode = code.substring(nodeToExtract.start, nodeToExtract.end);

    return sourceCode;
  } catch (error) {
    logErrorRed(
      `Error getting source code for ${getNodeName(path.node)}: ${error}`
    );
  }
};

module.exports = getSourceCode;
