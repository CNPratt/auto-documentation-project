const { logBgGreen, logBgYellow } = require("../console-utils/chalkUtils");

const checkPreviousFileObject = (previousFileObject, original) => {
  let root = previousFileObject;

  let currentLocation = previousFileObject;

  original.arrayPath.forEach((scopeObject, index) => {
    const { key, scope } = scopeObject;

    if (index === 0) {
      currentLocation = root[key];
      return;
    }

    currentLocation = currentLocation.find((item) => item.name === scope)[key];
  });

  const foundObject = currentLocation.find(
    (item) =>
      item.name === original.name &&
      item.sourceCodeHash === original.sourceCodeHash
  );

  if (foundObject) {
    logBgGreen(`Found object for ${original.name}: ${foundObject.name}`);

    original.description = foundObject.description;

    return foundObject;
  } else {
    logBgYellow(`No previous data object found for ${original.name}`);
  }
};

module.exports = checkPreviousFileObject;
