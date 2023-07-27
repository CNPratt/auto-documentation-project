// Function Declaration
const functionDeclarationRegex = /function\s+(\w+)\s*\([^)]*\)\s*{/g;

// Function Constructor
const functionConstructorRegex = /new\s+Function\s*\(([^)]*)\)\s*{/g;

// Function Declaration Inside Object Literal
const objectLiteralFunctionRegex = /{\s*(\w+)\s*\([^)]*\)\s*{/g;

// Function Declaration Inside Class
const classFunctionDeclarationRegex = /class\s+\w+\s*{[^}]*\s*(\w+)\s*\([^)]*\)\s*{/g;

// Function Expression Inside Object Literal
const objectLiteralExpressionRegex = /{\s*\w+:\s*function\s*\([^)]*\)\s*{/g;

// Function Expression Inside Class
const classFunctionExpressionRegex = /class\s+\w+\s*{[^}]*\s*(\w+)\s*=\s*function\s*\([^)]*\)\s*{/g;

// Function Expression Inside Arrow Function (Excludes arrow functions)
const arrowFunctionInsideFunctionRegex = /{\s*(?!.*=>)\s*(\w+)\s*\([^)]*\)\s*{/g;

// Function Declaration with Default Parameters
const functionWithDefaultParametersRegex = /function\s+(\w+)\s*\([^)]*\)\s*{/g;

// Named Function Expression (Used for self-recursion)
const namedFunctionExpressionRegex = /function\s+(\w+)\s*\([^)]*\)\s*{/g;

// Function Expression with Rest Parameters
const functionWithRestParametersRegex = /function\s*\(\s*\.{3}\w*\s*\)\s*{/g;

// Function Expression Inside Template Literal
const functionInsideTemplateLiteralRegex = /`.*function\s*(\w+)\s*\([^)]*\)\s*{/g;

const functionRegexArray = [
  functionDeclarationRegex,
  functionConstructorRegex,
  objectLiteralFunctionRegex,
  classFunctionDeclarationRegex,
  objectLiteralExpressionRegex,
  classFunctionExpressionRegex,
  arrowFunctionInsideFunctionRegex,
  functionWithDefaultParametersRegex,
  namedFunctionExpressionRegex,
  functionWithRestParametersRegex,
  functionInsideTemplateLiteralRegex,
];

exports.functionRegexArray = functionRegexArray;
