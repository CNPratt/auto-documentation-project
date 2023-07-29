const promptUserForApi = require("./promptUserForApi");

const config = require("../config");

const getDescriptionFromAPI = async (documentation, sourceCode) => {
  // Get the component code for description generation
  const componentCode = `${config.prefaceStatement}: ${documentation.component}\n${sourceCode}`;

  console.log("Getting description for component:", documentation.component);

  if (config.useOpenAI) {
    try {
      await promptUserForApi(documentation, componentCode);
    } catch (error) {
      console.error("Error fetching description:", error.message);
      // In case of an error, set description to an empty string
      documentation.description = "";
    }
  } else {
    documentation.description = "This is a test description";
  }
};

module.exports = getDescriptionFromAPI;
