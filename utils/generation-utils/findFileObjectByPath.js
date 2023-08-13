const pathUtil = require("path");
const fs = require("fs");
const { logGreen, logYellow } = require("../console-utils/chalkUtils.js");

const findFileObjectByPath = (fileObject) => {
  let files = null;

  const objectivePath = pathUtil.join(
    __dirname,
    "../../generated-documentation/generated-documentation.js"
  );

  if (fs.existsSync(objectivePath)) {
    files = require("../../generated-documentation/generated-documentation.js");
  }

  if (files) {
    const file = files.find((file) => file.filepath === fileObject.filepath);

    logGreen(`Found file object for ${fileObject.name}`);

    return file;
  }

  logYellow(`No file object found for ${path}`);

  return null;
};

module.exports = findFileObjectByPath;
