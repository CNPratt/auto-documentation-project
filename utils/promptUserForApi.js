const readline = require("readline");
const getComponentDescription = require("./getComponentDescription");

const promptUserForApi = async (documentation, componentCode) => {
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

module.exports = promptUserForApi;
