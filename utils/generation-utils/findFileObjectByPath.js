const pathUtil = require("path");
const fs = require("fs");

const findFileObjectByPath = (path) => {
  let files = null;

  const objectivePath = pathUtil.join(
    __dirname,
    "../../generated-documentation/generated-documentation.js"
  );

  if (fs.existsSync(objectivePath)) {
    files = require("../../generated-documentation/generated-documentation.js");
  }

  if (files) {
    const file = files.find((file) => file.filepath === path);

    // console.log(file);

    return file;
  }

  return null;
};

module.exports = findFileObjectByPath;
