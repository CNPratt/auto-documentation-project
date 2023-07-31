// Boolean to control whether to use calls to the OpenAI API to generate descriptions
const useOpenAI = true;

// The model to use for the OpenAI API
const model = "gpt-3.5-turbo";

// Your OpenAI API key
const apiKey = "YOUR_API_KEY_HERE";

// If user prompts are enabled, the program will ask the user if they want to make the
// API call for each file and offer the chance to re-do a call if they reject the description
// Otherwise it will make the API call for each file and save the description without asking the user
const enableUserPrompts = true;

// The endpoint for the OpenAI API
const openAiEndpoint = "https://api.openai.com/v1/chat/completions";

// Boolean to control whether to limit the maximum number of tokens for the OpenAI API in its response
const useMaxTokens = false;

// The maximum number of tokens to use for the OpenAI API in its response
const maxTokens = 300;

// // Descriptive statement added to the beginning of the OpenAI prompt
const prefaceStatement =
  "Please provide a high level overview of purpose and functionality for the following React component code:";

// const prefaceStatement =
//   " Please provide an overall analysis of this React component and any glaring issues:";

// This is the relative path between where we are running this file and the root directory of the project
const connectorToRootFolder = "../../";

const pathFromRootToDesiredDirectory =
  "YOUR_PATH_FROM_ROOT_TO_DESIRED_DIRECTORY_HERE";

// This is the relative path between where we are running this file and where this program should look for files
// The connectorToRootFolder is added to the beginning of this path to get to the higher-level directory "auto-documentation-project"
// Simply replace the pathFromRootToDesiredDirectory with the path from the "auto-documentaion-project" root directory to the directory you want to document
const relativeDirectoryConnector = `${connectorToRootFolder}${pathFromRootToDesiredDirectory}`;

let updatedComponents = [];

module.exports = {
  useOpenAI,
  model,
  apiKey,
  enableUserPrompts,
  openAiEndpoint,
  useMaxTokens,
  maxTokens,
  prefaceStatement,
  relativeDirectoryConnector,
  updatedComponents,
};
