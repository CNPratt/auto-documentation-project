// Boolean to control whether to use calls to the OpenAI API to generate descriptions
const useOpenAI = true;

const model = "gpt-3.5-turbo";
// const apiKey = "YOUR_API_KEY_HERE";

const apiKey = "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";

const openAiEndpoint = "https://api.openai.com/v1/chat/completions";
const maxTokens = 300;

// Descriptive statement added to the beginning of the OpenAI prompt
const prefaceStatement =
  "Please provide a high level overview of purpose and functionality for the following React component code in 300 or less characters:";

const connectorToRootFolder = "../";

// This is the relative path between where we are running this file and where this program should look for files
// The connectorToRootFolder is added to the beginning of this path to get to the higher-level directory "auto-documentation-project"
// Simply replace "YOUR_PATH_FROM_ROOT_TO_YOUR_DIRECTORY" with the path from the "auto-documentaion-project" root directory to the directory you want to document
const relativeDirectoryConnector = `${connectorToRootFolder}YOUR_PATH_FROM_ROOT_TO_YOUR_DIRECTORY`;

let updatedComponents = [];

module.exports = {
  useOpenAI,
  model,
  apiKey,
  openAiEndpoint,
  maxTokens,
  prefaceStatement,
  relativeDirectoryConnector,
  updatedComponents,
};
