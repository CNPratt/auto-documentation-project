// Function Component (Function Declaration)
const functionComponentRegex = /function\s+(\w+)/g;

// Arrow Function Component (Variable Declaration)
const arrowFunctionComponentRegex = /const\s+(\w+)\s*=\s*\(?([^)]*)\)?\s*=>/g;

// Functional Component with Hooks (Variable Declaration)
const functionalComponentWithHooksRegex =
  /const\s+(\w+)\s*=\s*\(?([^)]*)\)?\s*=>/g;

// Class Component (Class Declaration)
const classComponentRegex =
  /class\s+(\w+)\s+extends\s+(?:React\.Component|Component|PureComponent)/g;

// Stateless Function Component (Variable Declaration)
const statelessFunctionComponentRegex = /const\s+(\w+)\s*=\s*function/g;

// Higher-Order Component (Variable Declaration)
const hocComponentRegex = /const\s+(\w+)\s*=\s*withLog\(\w+\);/g;

// Legacy createClass Component (Variable Declaration)
const createClassComponentRegex = /const\s+(\w+)\s*=\s*React.createClass/g;

// Variable Declaration Starting with Capital Letter
const variableStartsWithCapitalRegex = /const\s+([A-Z]\w*)\s*=/;

// Regex pattern to match functional component declaration
const functionDeclarationRegex = /export\s+default\s+function\s+(\w+)/;

const componentRegexArray = [
  functionComponentRegex,
  arrowFunctionComponentRegex,
  functionalComponentWithHooksRegex,
  classComponentRegex,
  statelessFunctionComponentRegex,
  hocComponentRegex,
  createClassComponentRegex,
  variableStartsWithCapitalRegex,
  functionDeclarationRegex,
];

exports.componentRegexArray = componentRegexArray;
