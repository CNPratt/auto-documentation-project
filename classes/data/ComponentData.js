const getCodeFromNode = require("../../utils/ast-utils/getCodeFromNode");

class ComponentData {
  constructor(name, node) {
    this.name = name;
    this.code = getCodeFromNode(node);
  }
}

module.exports = ComponentData;
