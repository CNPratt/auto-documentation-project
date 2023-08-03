const userInputSequence = require("../console-utils/userInputSequence");
const postPromptToApi = require("./postPromptToApi");
const chalkUtils = require("../console-utils/chalkUtils");
const logErrorRed = chalkUtils.logErrorRed;

const config = require("../../config");

const getDescription = async (documentation, sourceCode) => {
  // Get the component code for description generation
  const componentCode = `${config.prefaceStatement}: ${documentation.name}\n${sourceCode}`;

  console.log("Getting description for component:", documentation.name);

  if (config.useOpenAI) {
    try {
      if (config.enableUserInputSequence) {
        await userInputSequence(documentation, componentCode);
      } else {
        documentation.description = await postPromptToApi(componentCode);
      }
    } catch (error) {
      logErrorRed("Error fetching description:", error.message);
      // In case of an error, set description to an empty string
      documentation.description = "";
    }
  } else {
    documentation.description = "This is a test description";
  }
};

module.exports = getDescription;
