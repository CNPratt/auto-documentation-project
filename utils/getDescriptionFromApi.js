const promptUserForApi = require("./promptUserForApi");
const getComponentDescription = require("./getComponentDescription");
const chalkUtils = require("./chalkUtils");
const logErrorRed = chalkUtils.logErrorRed;

const config = require("../config");

const getDescriptionFromAPI = async (documentation, sourceCode) => {
  // Get the component code for description generation
  const componentCode = `${config.prefaceStatement}: ${documentation.component}\n${sourceCode}`;

  console.log("Getting description for component:", documentation.component);

  if (config.useOpenAI) {
    try {
      if (config.enableUserPrompts) {
        await promptUserForApi(documentation, componentCode);
      } else {
        documentation.description = await getComponentDescription(
          componentCode
        );
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

module.exports = getDescriptionFromAPI;
