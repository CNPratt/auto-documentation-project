// Function Component (Function Declaration)
const functionComponentRegex = /function\s+([A-Z]\w+)\s*\([^)]*\)\s*{/g;

// Arrow Function Component (Variable Declaration)
const arrowFunctionComponentRegex =
  /const\s+([A-Z]\w+)\s*=\s*\(?([^)]*)\)?\s*=>/g;

// Functional Component with Hooks (Variable Declaration)
const functionalComponentWithHooksRegex =
  /const\s+([A-Z]\w+)\s*=\s*\(?([^)]*)\)?\s*=>/g;

// Class Component (Class Declaration)
const classComponentRegex =
  /class\s+([A-Z]\w+)\s+extends\s+(?:React\.Component|Component|PureComponent)/g;

// Stateless Function Component (Variable Declaration)
const statelessFunctionComponentRegex = /const\s+([A-Z]\w+)\s*=\s*function/g;

// Higher-Order Component (Variable Declaration)
const hocComponentRegex = /const\s+([A-Z]\w+)\s*=\s*withLog\(\w+\);/g;

// Legacy createClass Component (Variable Declaration)
const createClassComponentRegex = /const\s+([A-Z]\w+)\s*=\s*React.createClass/g;

// Variable Declaration Starting with Capital Letter
const variableStartsWithCapitalRegex = /const\s+([A-Z]\w*)\s*=/g;

// Regex pattern to match functional component declaration
const functionDeclarationRegex = /export\s+default\s+function\s+([A-Z]\w+)/g;

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
