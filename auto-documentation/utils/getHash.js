const crypto = require("crypto");

function getHash(inputString) {
  const hash = crypto.createHash("sha256");
  hash.update(inputString);
  return hash.digest("hex");
}

module.exports = getHash;
