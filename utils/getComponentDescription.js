const https = require("https");

const { logErrorRed, logMagenta } = require("./chalkUtils");
const config = require("../config");

// Function to send the code to the ChatGPT API and obtain the description
const getComponentDescription = async (componentCode) => {
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
      Authorization: `Bearer ${config.apiKey}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(config.openAiEndpoint, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const responseData = JSON.parse(data);
        console.log("Response from ChatGPT API:", responseData);

        // Check if the response data has the expected data
        if (responseData.choices && responseData.choices[0]) {
          logMagenta("Description: " + responseData.choices[0].message.content);

          resolve(responseData.choices[0].message.content);
        } else {
          reject(new Error("API response does not have expected data."));
        }
      });
    });

    req.on("error", (error) => {
      logErrorRed(
        "Error while fetching description from ChatGPT API:",
        error.message
      );
      reject(error);
    });

    req.write(requestBody);
    req.end();
  });
};

module.exports = getComponentDescription;
