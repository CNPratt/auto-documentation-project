const chalk = require("chalk");

const generateChalkLog = (
  consoleType,
  color,
  message,
  secondaryMessage = ""
) => {
  const totalMessage = `${message} ${secondaryMessage ? secondaryMessage : ""}`;
  console.log(chalk[color](totalMessage));
};

const logGreen = (message, secondaryMessage) =>
  generateChalkLog("log", "green", message, secondaryMessage);

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

const chalkUtils = {
  logGreen,
  logYellow,
  logBlue,
  logMagenta,
  logCyan,
  logWhite,
  logBlack,
  logGray,
  logErrorRed,
};

module.exports = chalkUtils;
