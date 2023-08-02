const getHash = require("../file-utils/getHash");
const getDescription = require("../api-utils/getDescription");
const findComponentDocumentationObject = require("../file-utils/findComponentDocumentationObject");

const config = require("../../config");

const parseComponentObjects = async (componentObject, previousFileDoc) => {
  const componentDocumentation = {
    component: componentObject.name,
    variables: [],
    functions: [],
    description: "",
    sourceCodeHash: getHash(componentObject.code),
  };

  const previousFileDocComponents =
    (previousFileDoc && previousFileDoc.components) || [];

  // Check if there is a matching object in the previously generated documentations
  const matchedObject = findComponentDocumentationObject(
    componentDocumentation.component,
    previousFileDocComponents
  );

  // If a matching object was found and the encoded source code matches the encoded source code
  // in the documentation object, return the previous documentation object early
  if (
    matchedObject &&
    matchedObject.sourceCodeHash === componentDocumentation.sourceCodeHash
  ) {
    return matchedObject;
  }

  // If the encoded source code does not match the encoded source code in the documentation object, continue with parsing
  // and add the component name to the list of updated components
  config.updatedComponents.push(componentDocumentation.component);

  // Parsing functions and variables should go here

  // Get the description from the OpenAI API
  await getDescription(componentDocumentation, componentObject.code);

  return componentDocumentation;
};

module.exports = parseComponentObjects;
