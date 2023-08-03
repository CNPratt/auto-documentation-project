const chalk = require("chalk");

const generateChalkLog = (
  consoleType,
  color,
  message,
  secondaryMessage = ""
) => {
  console[consoleType](chalk[color](message), chalk[color](secondaryMessage));
};

const logGreen = (message, secondaryMessage) =>
  generateChalkLog("log", "green", message, secondaryMessage);

const logNativeGreen = (message, secondaryMessage) =>
  // log component green without chalk with the escape sequence
  console.log("\x1b[32m", message, secondaryMessage);

const logYellow = (message, secondaryMessage) =>
  generateChalkLog("log", "yellow", message, secondaryMessage);

const logBlue = (message, secondaryMessage) =>
  generateChalkLog("log", "blue", message, secondaryMessage);

const logMagenta = (message, secondaryMessage) =>
  generateChalkLog("log", "magenta", message, secondaryMessage);

const logCyan = (message, secondaryMessage) =>
  generateChalkLog("log", "cyan", message, secondaryMessage);

const logWhite = (message, secondaryMessage) =>
  generateChalkLog("log", "white", message, secondaryMessage);

const logBlack = (message, secondaryMessage) =>
  generateChalkLog("log", "black", message, secondaryMessage);

const logGray = (message, secondaryMessage) =>
  generateChalkLog("log", "gray", message, secondaryMessage);

const logErrorRed = (message, secondaryMessage) =>
  generateChalkLog("error", "red", message, secondaryMessage);

const logErrorBgRed = (message, secondaryMessage) =>
  generateChalkLog("error", "bgRed", message, secondaryMessage);

const chalkUtils = {
  logGreen,
  logNativeGreen,
  logYellow,
  logBlue,
  logMagenta,
  logCyan,
  logWhite,
  logBlack,
  logGray,
  logErrorRed,
  logErrorBgRed,
};

module.exports = chalkUtils;
