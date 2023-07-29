// Boolean to control whether to use calls to the OpenAI API to generate descriptions
const useOpenAI = true;

// Descriptive statement added to the beginning of the OpenAI prompt
const prefaceStatement =
  "Please provide a high level overview of purpose and functionality for the following React component code in 300 or less characters:";

// This is the relative path between where we are running this file and where this program should look for files
const relativeDirectoryConnector = "../../../../iforager_react_native/scripts";

let updatedComponents = [];

module.exports = {
  useOpenAI,
  prefaceStatement,
  relativeDirectoryConnector,
  updatedComponents,
};
