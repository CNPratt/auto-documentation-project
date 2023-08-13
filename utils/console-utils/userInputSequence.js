const readline = require("readline");
const postPromptToApi = require("../api-utils/postPromptToApi");
const chalk = require("chalk");

// Function to ask the user if they want to make the API call for this piece of code
const userInputSequence = async (documentation, prompt) => {
  let counter = 0;
  let shouldContinue = false;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (!shouldContinue) {
    const originalQuestion = chalk.bgGreen(
      `Make API call for component: ${documentation.name}? (yes/no) `
    );

    const regenerateQuestion = chalk.bgGreen(
      `Make another API call for component: ${documentation.name}? (yes/no) `
    );
    const question = counter === 0 ? originalQuestion : regenerateQuestion;
    counter++;

    // Ask the user if they want to make the API call for this file
    const makeApiCall = await new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.toLowerCase() === "yes");
      });
    });
    if (makeApiCall) {
      documentation.description = await postPromptToApi(prompt);
      const coloredQuestion = chalk.bgGreen(
        `Would you like to save the description? (yes/no) `
      );

      const shouldSave = await new Promise((resolve) => {
        rl.question(coloredQuestion, (answer) => {
          resolve(answer.toLowerCase() === "yes");
        });
      });

      shouldContinue = shouldSave;
    } else {
      documentation.description = "";
      shouldContinue = true;
    }
  }

  rl.close();
};

module.exports = userInputSequence;
