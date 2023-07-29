const fs = require("fs");
const path = require("path");

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

module.exports = getFiles;
