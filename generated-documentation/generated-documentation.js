module.exports = {
  name: "file.js",
  filepath: "../../classes/documents/FileDocument.js",
  functionsArray: [],
  classesArray: [
    {
      name: "FileDocument",
      functionsArray: [
        {
          name: "constructor",
          functionsArray: [
            {
              name: "hasExactMatch",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode: "() => false",
            },
          ],
          classesArray: [],
          variablesArray: [],
          sourceCode:
            'constructor(filePath) {\n    this.filePath = filePath;\n    this.name = filePath.split("/").pop();\n    this.sourceCodeHash = "";\n    this.components = [];\n    this.classes = [];\n    this.functions = [];\n    this.variables = [];\n    this.imports = [];\n    this.exports = [];\n    this.previousFileMismatchDocumentation = null;\n    // temp\n    this.getSourceCode = null;\n    this.hasExactMatch = () => false;\n  }',
        },
        {
          name: "initializeFileData",
          functionsArray: [
            {
              name: "getSourceCode",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode: "() => sourceCode",
            },
            {
              name: "hasExactMatch",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode: "() => true",
            },
            {
              name: "getPreviousFileMismatchDocumentation",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                "() =>\n            matchingFilePathDocumentationObject",
            },
          ],
          classesArray: [],
          variablesArray: [
            {
              name: "sourceCode",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                'const sourceCode = await fs.promises.readFile(this.filePath, "utf-8");',
            },
            {
              name: "matchingFilePathDocumentationObject",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                "const matchingFilePathDocumentationObject =\n        await this.findMatchingFileDocs();",
            },
          ],
          sourceCode:
            'initializeFileData = async () => {\n    try {\n      const sourceCode = await fs.promises.readFile(this.filePath, "utf-8");\n\n      this.getSourceCode = () => sourceCode;\n      this.sourceCodeHash = getHash(sourceCode);\n\n      const matchingFilePathDocumentationObject =\n        await this.findMatchingFileDocs();\n\n      if (matchingFilePathDocumentationObject) {\n        if (\n          matchingFilePathDocumentationObject.sourceCodeHash ===\n          this.sourceCodeHash\n        ) {\n          logGreen("Exact match found for " + this.filePath);\n          Object.assign(this, matchingFilePathDocumentationObject);\n          this.hasExactMatch = () => true;\n        } else {\n          logBlue("Source code mismatch found for " + this.filePath);\n          this.getPreviousFileMismatchDocumentation = () =>\n            matchingFilePathDocumentationObject;\n          await this.initializeFileDocument(sourceCode);\n        }\n      } else {\n        logCyan("No match found for " + this.filePath);\n        await this.initializeFileDocument(sourceCode);\n      }\n    } catch (error) {\n      logErrorRed(\n        `Error initializing file data for ${this.filePath}. Error: ${error.message}`\n      );\n    }\n  };',
        },
        {
          name: "initializeFileDocument",
          functionsArray: [],
          classesArray: [],
          variablesArray: [
            {
              name: "ast",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                'const ast = babelParser.parse(sourceCode, {\n      sourceType: "module",\n      plugins: ["jsx"],\n    });',
            },
            {
              name: "fileTraversalMap",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                "const fileTraversalMap = Object.assign(\n      {},\n      fileFunctionTraversalMap(CodeBlockDocument),\n      fileClassTraversalMap(CodeBlockDocument),\n      fileVariableTraversalMap(CodeBlockDocument),\n      importTraversalMap\n    );",
            },
          ],
          sourceCode:
            'initializeFileDocument = async (sourceCode) => {\n    console.log("Initializing file document for " + this.filePath);\n\n    sourceCode = sourceCode.replaceAll(\n      "super(",\n      "constructorSuperPlaceholder("\n    );\n    // Generate an AST from the source code\n    const ast = babelParser.parse(sourceCode, {\n      sourceType: "module",\n      plugins: ["jsx"],\n    });\n\n    // combine all traversal maps into one with object\n    const fileTraversalMap = Object.assign(\n      {},\n      fileFunctionTraversalMap(CodeBlockDocument),\n      fileClassTraversalMap(CodeBlockDocument),\n      fileVariableTraversalMap(CodeBlockDocument),\n      importTraversalMap\n    );\n\n    // Traverse the AST and populate the file data by calling the functions in the traversal map\n    // This object is passed as the fourth argument to the traverse function so\n    // that the functions in the traversal map can access the FileDocument object\n    babelTraverse.default(ast, fileTraversalMap, null, this);\n\n    config.updatedFiles.push(this.filePath);\n    await this.getFileDescription();\n  };',
        },
        {
          name: "findMatchingFileDocs",
          functionsArray: [
            {
              name: null,
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                "(doc) => {\n        return doc.filePath === this.filePath;\n      }",
            },
          ],
          classesArray: [],
          variablesArray: [
            {
              name: "relativeDocsFilePath",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                'const relativeDocsFilePath =\n      "../../generated-documentation/generated-documentation.js";',
            },
            {
              name: "documentationFilePath",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                "const documentationFilePath = path.join(__dirname, relativeDocsFilePath);",
            },
            {
              name: "matchingObject",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode: "let matchingObject = null;",
            },
            {
              name: "documentationData",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                "const documentationData = require(relativeDocsFilePath);",
            },
          ],
          sourceCode:
            'findMatchingFileDocs = () => {\n    // Relative path to the generated documentation file used to require it if it exists\n    const relativeDocsFilePath =\n      "../../generated-documentation/generated-documentation.js";\n\n    // Absolute path to the generated documentation file used to find the matching object if it exists\n    const documentationFilePath = path.join(__dirname, relativeDocsFilePath);\n\n    let matchingObject = null;\n\n    // Check if the file exists\n    if (fs.existsSync(documentationFilePath)) {\n      // The file exists, so you can require it\n      const documentationData = require(relativeDocsFilePath);\n\n      // Now you can use the documentationData as needed\n      matchingObject = documentationData.find((doc) => {\n        return doc.filePath === this.filePath;\n      });\n    }\n\n    if (matchingObject) {\n    } else {\n      logGreen("No matching object found for " + this.filePath);\n    }\n\n    return matchingObject;\n  };',
        },
        {
          name: "getFileDescription",
          functionsArray: [],
          classesArray: [],
          variablesArray: [
            {
              name: "code",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode: "const code = this.getSourceCode();",
            },
          ],
          sourceCode:
            "getFileDescription = async () => {\n    try {\n      const code = this.getSourceCode();\n\n      // If there is a matched component documentation object, push it instead of generating a new one\n      if (!this.hasExactMatch()) {\n        // Get the description from the OpenAI API\n        await getDescription(this, code);\n\n        config.updatedComponents.push(this.name);\n\n        if (!this.description) {\n          await this.getChildrenDescriptions();\n        }\n      }\n    } catch (error) {\n      logErrorRed(\n        `Error parsing documentation for ${this.name}. Error: ${error.message}`\n      );\n    }\n  };",
        },
        {
          name: "getChildrenDescriptions",
          functionsArray: [],
          classesArray: [],
          variablesArray: [
            {
              name: "codeBlockArraysArray",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode:
                "const codeBlockArraysArray = [\n      this.components,\n      this.classes,\n      this.functions,\n      this.variables,\n    ];",
            },
            {
              name: "codeBlocksArray",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode: "const codeBlocksArray",
            },
            {
              name: "codeBlockDocument",
              functionsArray: [],
              classesArray: [],
              variablesArray: [],
              sourceCode: "const codeBlockDocument",
            },
          ],
          sourceCode:
            "getChildrenDescriptions = async () => {\n    const codeBlockArraysArray = [\n      this.components,\n      this.classes,\n      this.functions,\n      this.variables,\n    ];\n\n    // Parse the documentation for each code block in the file\n    for (const codeBlocksArray of codeBlockArraysArray) {\n      for (const codeBlockDocument of codeBlocksArray) {\n        await codeBlockDocument.getCodeBlockDescriptions(\n          this.previousFileMismatchDocumentation\n        );\n      }\n    }\n  };",
        },
      ],
      variablesArray: [],
      classesArray: [],
      sourceCode:
        'class FileDocument {\n  constructor(filePath) {\n    this.filePath = filePath;\n    this.name = filePath.split("/").pop();\n    this.sourceCodeHash = "";\n    this.components = [];\n    this.classes = [];\n    this.functions = [];\n    this.variables = [];\n    this.imports = [];\n    this.exports = [];\n    this.previousFileMismatchDocumentation = null;\n    // temp\n    this.getSourceCode = null;\n    this.hasExactMatch = () => false;\n  }\n\n  initializeFileData = async () => {\n    try {\n      const sourceCode = await fs.promises.readFile(this.filePath, "utf-8");\n\n      this.getSourceCode = () => sourceCode;\n      this.sourceCodeHash = getHash(sourceCode);\n\n      const matchingFilePathDocumentationObject =\n        await this.findMatchingFileDocs();\n\n      if (matchingFilePathDocumentationObject) {\n        if (\n          matchingFilePathDocumentationObject.sourceCodeHash ===\n          this.sourceCodeHash\n        ) {\n          logGreen("Exact match found for " + this.filePath);\n          Object.assign(this, matchingFilePathDocumentationObject);\n          this.hasExactMatch = () => true;\n        } else {\n          logBlue("Source code mismatch found for " + this.filePath);\n          this.getPreviousFileMismatchDocumentation = () =>\n            matchingFilePathDocumentationObject;\n          await this.initializeFileDocument(sourceCode);\n        }\n      } else {\n        logCyan("No match found for " + this.filePath);\n        await this.initializeFileDocument(sourceCode);\n      }\n    } catch (error) {\n      logErrorRed(\n        `Error initializing file data for ${this.filePath}. Error: ${error.message}`\n      );\n    }\n  };\n\n  initializeFileDocument = async (sourceCode) => {\n    console.log("Initializing file document for " + this.filePath);\n\n    sourceCode = sourceCode.replaceAll(\n      "super(",\n      "constructorSuperPlaceholder("\n    );\n    // Generate an AST from the source code\n    const ast = babelParser.parse(sourceCode, {\n      sourceType: "module",\n      plugins: ["jsx"],\n    });\n\n    // combine all traversal maps into one with object\n    const fileTraversalMap = Object.assign(\n      {},\n      fileFunctionTraversalMap(CodeBlockDocument),\n      fileClassTraversalMap(CodeBlockDocument),\n      fileVariableTraversalMap(CodeBlockDocument),\n      importTraversalMap\n    );\n\n    // Traverse the AST and populate the file data by calling the functions in the traversal map\n    // This object is passed as the fourth argument to the traverse function so\n    // that the functions in the traversal map can access the FileDocument object\n    babelTraverse.default(ast, fileTraversalMap, null, this);\n\n    config.updatedFiles.push(this.filePath);\n    await this.getFileDescription();\n  };\n\n  findMatchingFileDocs = () => {\n    // Relative path to the generated documentation file used to require it if it exists\n    const relativeDocsFilePath =\n      "../../generated-documentation/generated-documentation.js";\n\n    // Absolute path to the generated documentation file used to find the matching object if it exists\n    const documentationFilePath = path.join(__dirname, relativeDocsFilePath);\n\n    let matchingObject = null;\n\n    // Check if the file exists\n    if (fs.existsSync(documentationFilePath)) {\n      // The file exists, so you can require it\n      const documentationData = require(relativeDocsFilePath);\n\n      // Now you can use the documentationData as needed\n      matchingObject = documentationData.find((doc) => {\n        return doc.filePath === this.filePath;\n      });\n    }\n\n    if (matchingObject) {\n    } else {\n      logGreen("No matching object found for " + this.filePath);\n    }\n\n    return matchingObject;\n  };\n\n  getFileDescription = async () => {\n    try {\n      const code = this.getSourceCode();\n\n      // If there is a matched component documentation object, push it instead of generating a new one\n      if (!this.hasExactMatch()) {\n        // Get the description from the OpenAI API\n        await getDescription(this, code);\n\n        config.updatedComponents.push(this.name);\n\n        if (!this.description) {\n          await this.getChildrenDescriptions();\n        }\n      }\n    } catch (error) {\n      logErrorRed(\n        `Error parsing documentation for ${this.name}. Error: ${error.message}`\n      );\n    }\n  };\n\n  getChildrenDescriptions = async () => {\n    const codeBlockArraysArray = [\n      this.components,\n      this.classes,\n      this.functions,\n      this.variables,\n    ];\n\n    // Parse the documentation for each code block in the file\n    for (const codeBlocksArray of codeBlockArraysArray) {\n      for (const codeBlockDocument of codeBlocksArray) {\n        await codeBlockDocument.getCodeBlockDescriptions(\n          this.previousFileMismatchDocumentation\n        );\n      }\n    }\n  };\n}',
    },
  ],
  variablesArray: [
    {
      name: "config",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode: 'const config = require("../../config");',
    },
    {
      name: "CodeBlockDocument",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode: 'const CodeBlockDocument = require("./CodeBlockDocument");',
    },
    {
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode:
        'const {\n  logErrorRed,\n  logGreen,\n  logBlue,\n  logCyan,\n} = require("../../utils/console-utils/chalkUtils");',
    },
    {
      name: "fs",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode: 'const fs = require("fs");',
    },
    {
      name: "getHash",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode: 'const getHash = require("../../utils/file-utils/getHash");',
    },
    {
      name: "babelTraverse",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode: 'const babelTraverse = require("@babel/traverse");',
    },
    {
      name: "babelParser",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode: 'const babelParser = require("@babel/parser");',
    },
    {
      name: "path",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode: 'const path = require("path");',
    },
    {
      name: "fileFunctionTraversalMap",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode:
        'const fileFunctionTraversalMap = require("../../traversal-maps/file-maps/fileFunctionTraversalMap");',
    },
    {
      name: "fileClassTraversalMap",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode:
        'const fileClassTraversalMap = require("../../traversal-maps/file-maps/fileClassTraversalMap");',
    },
    {
      name: "fileVariableTraversalMap",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode:
        'const fileVariableTraversalMap = require("../../traversal-maps/file-maps/fileVariableTraversalMap");',
    },
    {
      name: "importTraversalMap",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode:
        'const importTraversalMap = require("../../traversal-maps/file-maps/importTraversalMap");',
    },
    {
      name: "getDescription",
      functionsArray: [],
      classesArray: [],
      variablesArray: [],
      sourceCode:
        'const getDescription = require("../../utils/api-utils/getDescription");',
    },
  ],
};
