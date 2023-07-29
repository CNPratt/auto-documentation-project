const getHash = require("./utils/getHash");
const logAst = require("./utils/logAst");
const createComponentObject = require("./utils/createComponentObject");
const nodeReturnsJsx = require("./utils/nodeReturnsJsx");

const fs = require("fs");
const path = require("path");
const https = require("https");
const util = require("util");
const readline = require("readline");

const babelCore = require("@babel/core");
const babelTypes = require("@babel/types");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
const generator = require("@babel/generator").default;

let updatedComponents = [];

// Boolean to control whether to use calls to the OpenAI API to generate descriptions
const useOpenAI = true;

// Descriptive statement added to the beginning of the OpenAI prompt
const prefaceStatement =
  "Please provide a high level overview of purpose and functionality for the following React component code in 300 or less characters:";

// This is the relative path between where we are running this file and where this program should look for files
const relativeDirectoryConnector = "../../../iforager_react_native/scripts";

// const nodeReturnsJSX = (node) => {
//   let hasJSX = false;
//   babelTraverse.default(node, {
//     enter(path) {
//       if (babelTypes.isJSX(path.node)) {
//         hasJSX = true;
//         path.stop();
//       }
//     },
//     noScope: true,
//   });

//   return hasJSX;
// };

const assembleComponents = (ast) => {
  const components = [];

  babelTraverse.default(ast, {
    FunctionDeclaration(path) {
      console.log("Function declaration:" + path.node.id.name);

      try {
        const hasJSX = nodeReturnsJsx(path.node);

        if (hasJSX) {
          const componentObject = createComponentObject(
            path.node.id.name,
            node
          );
          components.push(componentObject);
        }
      } catch (error) {
        console.error(
          "Error parsing function " + path.node.id.name + ":",
          error.message
        );
      }
    },

    VariableDeclaration(path) {
      if (
        path.node.declarations[0].init &&
        path.node.declarations[0].init.type === "ArrowFunctionExpression"
      ) {
        console.log("Arrow expression:" + path.node.declarations[0].id.name);

        try {
          const hasJSX = nodeReturnsJsx(path.node.declarations[0].init);

          if (hasJSX) {
            const componentObject = createComponentObject(
              path.node.declarations[0].id.name,
              node
            );
            components.push(componentObject);
          }
        } catch (error) {
          console.error(
            "Error parsing arrow function " +
              path.node.declarations[0].id.name +
              ":",
            error.message
          );
        }
      }
    },

    ClassDeclaration(path) {
      console.log("Class declaration:" + path.node.id.name);
      const hasJSX = nodeReturnsJsx(path.node);

      try {
        if (hasJSX) {
          const componentObject = createComponentObject(
            path.node.id.name,
            path.node
          );
          components.push(componentObject);
        }
      } catch (error) {
        console.error(
          "Error parsing class declaration " + path.node.id.name + ":",
          error.message
        );
      }
    },
  });

  return components;
};

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

const parseFunctions = (sourceCode, documentation) => {
  // Check if the source code contains any of the function declaration regexes in the functionRegexArray
};

const parseVariables = (sourceCode, documentation) => {
  // Check if the source code contains any of the variable declaration regexes in the variableRegexArray
};

// Define the new function
const promptUserForAPI = async (documentation, componentCode) => {
  let counter = 0;
  let shouldContinue = false;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (!shouldContinue) {
    const originalQuestion = `Make API call for file ${documentation.component}? (yes/no) `;
    const regenerateQuestion = `Make another API call for file ${documentation.component}? (yes/no) `;
    const question = counter === 0 ? originalQuestion : regenerateQuestion;
    counter++;

    // Ask the user if they want to make the API call for this file
    const makeApiCall = await new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.toLowerCase() === "yes");
      });
    });
    if (makeApiCall) {
      documentation.description = await getComponentDescription(componentCode);

      const shouldSave = await new Promise((resolve) => {
        rl.question(
          `Would you like to save the description? (yes/no) `,
          (answer) => {
            resolve(answer.toLowerCase() === "yes");
          }
        );
      });

      shouldContinue = shouldSave;
    } else {
      documentation.description = "This is a test description";
      shouldContinue = true;
    }
  }

  rl.close();
};

const getDescriptionFromAPI = async (documentation, sourceCode, useOpenAI) => {
  // Get the component code for description generation
  const componentCode = `${prefaceStatement}: ${documentation.component}\n${sourceCode}`;

  console.log("Getting description for component:", documentation.component);

  if (useOpenAI) {
    try {
      await promptUserForAPI(documentation, componentCode);
    } catch (error) {
      console.error("Error fetching description:", error.message);
      // In case of an error, set description to an empty string
      documentation.description = "";
    }
  } else {
    documentation.description = "This is a test description";
  }
};

const parseComponentObjects = async (componentObject) => {
  const documentation = {
    component: componentObject.name,
    variables: [],
    functions: [],
    description: "",
    sourceCodeHash: getHash(componentObject.code),
  };

  // Check if there is a matching object in the previously generated documentationz
  const matchedObject = findDocumentationObject(documentation.component);

  // If a matching object was found and the encoded source code matches the encoded source code
  // in the documentation object, return the previous documentation object early
  if (
    matchedObject &&
    matchedObject.sourceCodeHash === documentation.sourceCodeHash
  ) {
    return matchedObject;
  }

  // If the encoded source code does not match the encoded source code in the documentation object, continue with parsing
  // and add the component name to the list of updated components
  updatedComponents.push(documentation.component);

  // Parsing functions and variables should go here

  // Get the description from the OpenAI API
  await getDescriptionFromAPI(documentation, componentObject.code, useOpenAI);
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

        // Check if the response data has the expected data
        if (responseData.choices && responseData.choices[0]) {
          console.log(
            "Description: " + responseData.choices[0].message.content
          );

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

const getFileDocumentation = async (fileComponentObjects, masterDocument) => {
  // Parse the documentation for each component in the file
  for (const componentObject of fileComponentObjects) {
    try {
      const parsedDocumentation = await parseComponentObjects(componentObject);

      // console.log(parsedDocumentation);
      masterDocument.push(parsedDocumentation);
    } catch (error) {
      console.error(
        `Error parsing documentation for ${componentObject.name}. Error: ${error.message}`
      );
    }
  }
};

const getDocumentation = async (files) => {
  console.log("Getting documentation");

  // Clear the updated components array
  updatedComponents = [];

  const masterDocument = [];

  for (const file of files) {
    console.log(`Getting documentation for ${file}`);
    if (file.endsWith(".js")) {
      try {
        const sourceCode = await fs.promises.readFile(file, "utf-8");

        // Generate an AST from the source code
        const ast = babelParser.parse(sourceCode, {
          sourceType: "module",
          plugins: ["jsx"],
        });

        // Log the AST to the console
        // logAst(ast);

        const fileComponentObjects = assembleComponents(ast);

        await getFileDocumentation(fileComponentObjects, masterDocument);
      } catch (error) {
        console.error(
          `Error reading or parsing ${file}. Error: ${error.message}`
        );
      }
    }
  }
  return masterDocument;
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
