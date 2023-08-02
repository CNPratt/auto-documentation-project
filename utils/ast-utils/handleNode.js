const createComponentObject = require("../component-utils/createComponentObject");
const nodeReturnsJsx = require("./nodeReturnsJsx");
const {
  logWhite,
  logErrorRed,
  logCyan,
} = require("../console-utils/chalkUtils");

const handleNode = (identifier, nodeName, node, components) => {
  logWhite(`Identified ${identifier} declaration:`, nodeName);

  try {
    const hasJSX = nodeReturnsJsx(node);

    // If we have found a function, class, or arrow function that returns JSX, log it and add it to our components array

    if (hasJSX) {
      logCyan(`JSX found for ${nodeName}`);

      const componentObject = createComponentObject(nodeName, node);
      components.push(componentObject);
    }
  } catch (error) {
    logErrorRed(`Error parsing ${identifier} ` + nodeName + ":", error.message);
  }
};

module.exports = handleNode;
