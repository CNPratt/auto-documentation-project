const getCodeFromNode = require("../../utils/ast-utils/getCodeFromNode");

const importTraversalMap = {
  ImportDeclaration(path) {
    const source = path.node.source.value; // The module being imported from
    const specifiers = path.node.specifiers; // The variables being imported

    // Iterate over the specifiers to gather information about the imported variables
    specifiers.forEach((specifier) => {
      const importedName = specifier.imported ? specifier.imported.name : null; // The name of the imported variable as defined in the module
      const localName = specifier.local.name; // The name of the imported variable in the local scope

      // Add the import information to the imports array
      this.imports.push({
        source,
        importedName,
        localName,
        sourceCode: getCodeFromNode(path.node),
      });
    });
  },
};

module.exports = importTraversalMap;
