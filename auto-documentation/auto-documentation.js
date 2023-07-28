const componentRegexArrayFile = require("./regex-arrays/component-regex-array");
const functionRegexArrayFile = require("./regex-arrays/function-regex-array");
const variableRegexArrayFile = require("./regex-arrays/variable-regex-array");
const getHash = require("./utils/getHash");

const componentRegexArray = componentRegexArrayFile.componentRegexArray;
const functionRegexArray = functionRegexArrayFile.functionRegexArray;
const variableRegexArray = variableRegexArrayFile.variableRegexArray;

const fs = require("fs");
const path = require("path");
const https = require("https");
const util = require("util");

let updatedComponents = [];

// Boolean to control whether to use calls to the OpenAI API to generate descriptions
const useOpenAI = false;

// This is the path connector between where we are running this file and where this program should look for files
const relativeDirectoryConnector = "../scripts";

const getFiles = async (dir, baseDir = null) => {
  console.log("Getting files");

  const fullDir = baseDir ? path.join(baseDir, dir) : dir;
  const dirents = await fs.promises.readdir(fullDir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.join(fullDir, dirent.name);
      return dirent.isDirectory() ? getFiles(dirent.name, fullDir) : res;
    })
  );

  return Array.prototype.concat(...files);
};

// Function to find the object with the matching component name in the generated documentationData array
const findDocumentationObject = (componentName) => {
  const documentationFilePath = path.join(
    __dirname,
    "/generated-documentation/generated-documentation.js"
  );
  const filePath = "./generated-documentation/generated-documentation.js";
  let matchingObject = null;

  // Check if the file exists
  if (fs.existsSync(documentationFilePath)) {
    // The file exists, so you can require it
    const documentationData = require(filePath);

    // Now you can use the documentationData as needed
    matchingObject = documentationData.find(
      (doc) => doc.component === componentName
    );
  } else {
    console.log("File does not exist:", filePath);
    // Handle the case when the file doesn't exist
  }

  return matchingObject;
};

const isComponent = (sourceCode) => {
  // Check if the source code contains any of the component declaration regexes in the componentRegexArray
  for (const regex of componentRegexArray) {
    regex.lastIndex = 0; // Reset the lastIndex before each execution
    if (regex.test(sourceCode)) {
      return true;
    }
  }

  return false;
};

const extractComponentName = (sourceCode) => {
  // Check if the source code contains any of the component or variable declaration regexes in the componentRegexArray
  for (const regex of componentRegexArray) {
    regex.lastIndex = 0; // Reset the lastIndex before each execution
    const match = regex.exec(sourceCode);

    if (match && match[1]) {
      return match[1];
    }
  }

  return null; // Return null if no component name is found
};

const checkForChanges = (sourceCode, documentation) => {
  if (documentation.component) {
    // Encode and set the source code using a SHA265 hash to check against for changes
    const encodedSourceCode = getHash(sourceCode);
    documentation.encodedSourceCode = encodedSourceCode;

    const matchedObject = findDocumentationObject(documentation.component);

    // If the encoded source code matches the encoded source code in the documentation object, return the documentation object
    if (
      matchedObject &&
      matchedObject.encodedSourceCode === encodedSourceCode
    ) {
      return matchedObject;
    }

    // If the encoded source code does not match the encoded source code in the documentation object, continue with parsing
    // and add the component name to the list of updated components
    updatedComponents.push(documentation.component);
  }
};

const parseFunctions = (sourceCode, documentation) => {
  // Check if the source code contains any of the function declaration regexes in the functionRegexArray
};

const parseVariables = (sourceCode, documentation) => {
  // Check if the source code contains any of the variable declaration regexes in the variableRegexArray
};

const getDescriptionFromAPI = async (documentation, sourceCode, useOpenAI) => {
  // Get the component code for description generation
  const componentCode = `Please generate a description of the following React component, in the style of professional React code documentation: ${documentation.component}\n${sourceCode}`;

  console.log("Getting description for component:", documentation.component);

  if (useOpenAI) {
    try {
      documentation.description = await getComponentDescription(componentCode);
    } catch (error) {
      console.error("Error fetching description:", error.message);
      // In case of an error, set description to an empty string
      documentation.description = "";
    }
  } else {
    documentation.description = "This is a test description";
  }
};

const parseDocumentation = async (sourceCode) => {
  const documentation = {
    component: "",
    variables: [],
    functions: [],
    description: "",
  };

  if (isComponent(sourceCode)) {
    // Extract component name from the source code
    const componentName = extractComponentName(sourceCode);

    // If the component name is found, add it to the documentation object
    // Check if the first letter of the component name is capitalized, which indicates that it is a React component
    // If the first letter is not capitalized, it is a regular JavaScript variable and will not be included in the documentation
    if (componentName && componentName[0] === componentName[0].toUpperCase()) {
      documentation.component = componentName;

      const unchangedObject = checkForChanges(sourceCode, documentation);

      // If the source code has not changed, return the unchanged object
      // If the source code has changed, unchangedObject will be undefined and we will continue with parsing
      if (unchangedObject) {
        return unchangedObject;
      }

      // Parsing functions and variables should go here

      // Get the description from the OpenAI API
      await getDescriptionFromAPI(documentation, sourceCode, useOpenAI);
    }
  }

  return documentation;
};

// Function to send the code to the ChatGPT API and obtain the description
const getComponentDescription = async (componentCode) => {
  const apiKey = "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";
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const requestBody = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: componentCode }],
    // prompt: componentCode,
    max_tokens: 300,
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(endpoint, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const responseData = JSON.parse(data);
        console.log("Response from ChatGPT API:", responseData);
        if (responseData.choices && responseData.choices[0]) {
          resolve(responseData.choices[0].message.content);
        } else {
          reject(new Error("API response does not have expected data."));
        }
      });
    });

    req.on("error", (error) => {
      console.error(
        "Error while fetching description from ChatGPT API:",
        error.message
      );
      reject(error);
    });

    req.write(requestBody);
    req.end();
  });
};

const getDocumentation = async (files) => {
  console.log("Getting documentation");

  // Clear the updated components array
  updatedComponents = [];

  const documentation = [];
  for (const file of files) {
    console.log(`Getting documentation for ${file}`);
    if (file.endsWith(".js")) {
      try {
        const sourceCode = await fs.promises.readFile(file, "utf-8");
        const parsedDocumentation = await parseDocumentation(sourceCode);
        if (parsedDocumentation.component) {
          documentation.push(parsedDocumentation);
        }
      } catch (error) {
        console.error(
          `Error reading or parsing ${file}. Error: ${error.message}`
        );
      }
    }
  }
  return documentation;
};

const generateDocumentation = async () => {
  console.log("Generating documentation");
  const files = await getFiles(
    path.join(__dirname, relativeDirectoryConnector)
  );
  const documentation = await getDocumentation(files);

  const documentationFilePath = path.join(
    __dirname,
    "/generated-documentation/generated-documentation.js"
  );

  // Convert the documentation object to a string representation
  const jsCode = `module.exports = ${util.inspect(documentation, {
    depth: null,
  })};`;

  // Create a Buffer from the JavaScript code
  const buffer = Buffer.from(jsCode);

  // Write the buffer to the documentation.js file
  fs.writeFileSync(documentationFilePath, buffer);

  console.log("Documentation generated");
  console.log("Updated components:", updatedComponents);
};

generateDocumentation();
