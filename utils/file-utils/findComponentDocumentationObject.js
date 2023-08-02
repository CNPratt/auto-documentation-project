// Function to find the object with the matching component name in the generated documentationData array
const findComponentDocumentationObject = (
  componentName,
  fileComponentsData
) => {
  let matchingObject = null;

  // Now you can use the documentationData as needed
  matchingObject = fileComponentsData.find(
    (doc) => doc.component === componentName
  );

  return matchingObject;
};

module.exports = findComponentDocumentationObject;
