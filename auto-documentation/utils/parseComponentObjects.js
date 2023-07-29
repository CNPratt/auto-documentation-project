const getHash = require("./getHash");
const getDescriptionFromApi = require("./getDescriptionFromApi");
const findDocumentationObject = require("./findDocumentationObject");

const config = require("../config");

const parseComponentObjects = async (componentObject) => {
  const documentation = {
    component: componentObject.name,
    variables: [],
    functions: [],
    description: "",
    sourceCodeHash: getHash(componentObject.code),
  };

  // Check if there is a matching object in the previously generated documentationz
  const matchedObject = findDocumentationObject(documentation.component);

  // If a matching object was found and the encoded source code matches the encoded source code
  // in the documentation object, return the previous documentation object early
  if (
    matchedObject &&
    matchedObject.sourceCodeHash === documentation.sourceCodeHash
  ) {
    return matchedObject;
  }

  // If the encoded source code does not match the encoded source code in the documentation object, continue with parsing
  // and add the component name to the list of updated components
  config.updatedComponents.push(documentation.component);

  // Parsing functions and variables should go here

  // Get the description from the OpenAI API
  await getDescriptionFromApi(documentation, componentObject.code);

  return documentation;
};

module.exports = parseComponentObjects;
