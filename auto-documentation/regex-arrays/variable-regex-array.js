// Variable declaration with 'var' keyword
const varDeclarationRegex = /var\s+\w+/;

// Variable assignment with 'var' keyword
const varAssignmentRegex = /var\s+(\w+)\s*=\s*([^;\n]+)/;

// Variable declaration with 'let' keyword
const letDeclarationRegex = /let\s+\w+/;

// Variable assignment with 'let' keyword
const letAssignmentRegex = /let\s+(\w+)\s*=\s*([^;\n]+)/;

// Variable assignment with 'const' keyword
const constAssignmentRegex = /const\s+(\w+)\s*=\s*([^;\n]+)/;

// Destructuring assignment - Object
const objectDestructureRegex = /const\s+\{\s*\w+\s*\}\s*=\s*([^;\n]+)/;

// Destructuring assignment - Array
const arrayDestructureRegex = /const\s+\[\s*\w+\s*\]\s*=\s*([^;\n]+)/;

// Object property shorthand
const objectShorthandRegex = /const\s+\w+\s*=\s*\w+/;

// Array spread syntax
const arraySpreadRegex = /const\s+\w+\s*=\s*\[\s*\.\.\.\s*\w+\s*\]/;

// Rest parameters
const restParamsRegex = /function\s+\w+\s*\(\s*\.{3}\w*\s*\)/;

// 'with' statement (not recommended)
const withStatementRegex = /with\s+\(\w+\)\s*{/;

// 'eval' function (not recommended)
const evalAssignmentRegex = /const\s+\w+\s*=\s*eval\s*\([^)]*\)/;

// 'window' object (global scope)
const windowObjectAssignmentRegex = /window\.\w+\s*=\s*([^;\n]+)/;

// Direct assignment (implicitly creating global variables)
const directAssignmentRegex = /\w+\s*=\s*([^;\n]+)/;

// Combine all regexes into an array
const variableRegexArray = [
  varDeclarationRegex,
  varAssignmentRegex,
  letDeclarationRegex,
  letAssignmentRegex,
  constAssignmentRegex,
  objectDestructureRegex,
  arrayDestructureRegex,
  objectShorthandRegex,
  arraySpreadRegex,
  restParamsRegex,
  withStatementRegex,
  evalAssignmentRegex,
  windowObjectAssignmentRegex,
  directAssignmentRegex,
];

exports.variableRegexArray = variableRegexArray;
