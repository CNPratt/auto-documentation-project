const getHash = require("../file-utils/getHash");
const getSourceCode = require("./getSourceCode");

const createObject = (name, path, code) => {
  const source = getSourceCode(path, code);

  return {
    name,
    components: [],
    classes: [],
    functions: [],
    variables: [],
    // stringSourceCode: getSourceCode(path, code),
    sourceCode: () => source,
    sourceCodeHash: getHash(source),
    arrayPath: [],
  };
};

module.exports = createObject;
