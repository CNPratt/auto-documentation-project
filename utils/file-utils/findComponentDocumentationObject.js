// Function to find the object with the matching component name in the generated documentationData array
const findComponentDocumentationObject = (
  componentData,
  fileComponentsData
) => {
  let matchingObject = null;

  // Now you can use the documentationData as needed
  matchingObject = fileComponentsData.find((doc) => {
    return (
      doc.name === componentData.name &&
      doc.sourceCodeHash === componentData.sourceCodeHash
    );
  });

  return matchingObject;
};

module.exports = findComponentDocumentationObject;
