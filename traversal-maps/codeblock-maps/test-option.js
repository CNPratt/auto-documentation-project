const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const path = require("path");
const generate = require("@babel/generator").default;

function analyzeFile(ast) {
  const result = {
    name: "file.js",
    filepath: filePath,
    functionsArray: [],
    classesArray: [],
    variablesArray: [],
  };

  const stack = [result];

  traverse(ast, {
    enter(path) {
      const currentScope = stack[stack.length - 1];

      // Extract the source code for the current node from the original code
      const sourceCode = code.substring(path.node.start, path.node.end);

      console.log(currentScope);

      if (path.isFunctionDeclaration()) {
        const functionObject = {
          name: path.node.id ? path.node.id.name : null, // Named function
          functionsArray: [],
          classesArray: [],
          variablesArray: [],
          sourceCode,
        };
        currentScope.functionsArray.push(functionObject);
        stack.push(functionObject);
      } else if (
        path.isArrowFunctionExpression() ||
        path.isFunctionExpression()
      ) {
        if (path.parentPath.isClassProperty()) return;

        let functionName = null;
        if (path.parent.type === "VariableDeclarator") {
          functionName = path.parent.id.name; // Function assigned to variable
        } else if (path.parent.type === "AssignmentExpression") {
          functionName = path.parent.left.property.name; // Function assigned to property
        }
        const functionObject = {
          name: functionName,
          functionsArray: [],
          classesArray: [],
          variablesArray: [],
          sourceCode,
        };
        currentScope.functionsArray.push(functionObject);
        stack.push(functionObject);
      } else if (
        path.isClassProperty() &&
        (path.node.value.type === "ArrowFunctionExpression" ||
          path.node.value.type === "FunctionExpression")
      ) {
        // Handle class properties assigned to functions
        const functionObject = {
          name: path.node.key.name, // Name from the property key
          functionsArray: [],
          classesArray: [],
          variablesArray: [],
          sourceCode,
        };
        currentScope.functionsArray.push(functionObject);
        stack.push(functionObject);
      } else if (path.isClassDeclaration()) {
        const classObject = {
          name: path.node.id.name,
          functionsArray: [],
          variablesArray: [],
          classesArray: [],
          sourceCode,
        };
        currentScope.classesArray.push(classObject);
        stack.push(classObject);
      } else if (path.isVariableDeclaration() && currentScope.variablesArray) {
        // Handle arrow functions assigned to variables
        if (
          path.node.declarations[0].init &&
          path.node.declarations[0].init.type === "ArrowFunctionExpression"
        ) {
          const functionObject = {
            name: path.node.declarations[0].id.name,
            functionsArray: [],
            classesArray: [],
            variablesArray: [],
            sourceCode,
          };
          currentScope.functionsArray.push(functionObject);
          stack.push(functionObject);
        } else {
          const variableObject = {
            name: path.node.declarations[0].id.name,
            functionsArray: [],
            classesArray: [],
            variablesArray: [],
            sourceCode,
          };
          currentScope.variablesArray.push(variableObject);
        }
      } else if (path.isClassMethod()) {
        const methodObject = {
          name: path.node.key.name,
          functionsArray: [],
          classesArray: [],
          variablesArray: [],
          sourceCode,
        };
        currentScope.functionsArray.push(methodObject);
        stack.push(methodObject);
      }
    },
    exit(path) {
      if (
        path.isFunctionDeclaration() ||
        path.isArrowFunctionExpression() ||
        path.isFunctionExpression() ||
        path.isClassDeclaration() ||
        path.isClassMethod()
      ) {
        stack.pop();
      }
    },
  });

  return result;
}

const filePath = "../../classes/documents/FileDocument.js"; // Update this path
const projectFilePath = path.join(__dirname, filePath);

const code = fs.readFileSync(projectFilePath, "utf-8");
const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["jsx"], // Include if you are using JSX
});

const result = analyzeFile(ast);

// write to ../..//generated-documentation/generated-documentation.js
const resultString = JSON.stringify(result);

const resultStringWithExport = `module.exports = ${resultString}`;

const buffer = Buffer.from(resultStringWithExport);

fs.writeFileSync(
  path.join(
    __dirname,
    "../../generated-documentation/generated-documentation.js"
  ),
  buffer
);

console.log(JSON.stringify(result, null, 2));
