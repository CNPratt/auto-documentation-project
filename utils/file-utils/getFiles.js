const fs = require("fs");
const path = require("path");

const getFiles = async (dir, baseDir = null) => {
  const fullDir = baseDir ? path.join(baseDir, dir) : dir;
  const dirents = await fs.promises.readdir(fullDir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      if (dirent.name === "node_modules" || dirent.name === "build") {
        return [];
      }

      const res = path.join(fullDir, dirent.name);
      return dirent.isDirectory() ? getFiles(dirent.name, fullDir) : res;
    })
  );

  return Array.prototype.concat(...files);
};

module.exports = getFiles;
