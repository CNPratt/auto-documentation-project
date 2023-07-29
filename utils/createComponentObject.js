const getComponentCodeFromNode = require("./getComponentCodeFromNode");

// Component objects look like this:
// {
//   name: "ExampleComponent",
//   code: "const ExampleComponent = () => <div>Example JSX</div>",
// }

const createComponentObject = (name, node) => {
  const componentObject = {
    name: name,
    code: getComponentCodeFromNode(node),
  };

  return componentObject;
};

module.exports = createComponentObject;
