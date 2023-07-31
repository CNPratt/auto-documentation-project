const promptUserForApi = require("../console-utils/promptUserForApi");
const getDescriptionFromAPI = require("./getDescriptionFromApi");
const chalkUtils = require("../console-utils/chalkUtils");
const logErrorRed = chalkUtils.logErrorRed;

const config = require("../../config");

const getDescription = async (documentation, sourceCode) => {
  // Get the component code for description generation
  const componentCode = `${config.prefaceStatement}: ${documentation.component}\n${sourceCode}`;

  console.log("Getting description for component:", documentation.component);

  if (config.useOpenAI) {
    try {
      if (config.enableUserPrompts) {
        await promptUserForApi(documentation, componentCode);
      } else {
        documentation.description = await getDescriptionFromAPI(componentCode);
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
