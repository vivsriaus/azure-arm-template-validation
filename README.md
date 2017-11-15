# Run static validation checks for solution templates

This repository contains mocha tests, that runs static checks against a solution template folder containing mainTemplate.json, createUiDefinition.json and other template artifacts like nested templates, etc.

## How to run mocha tests

- git clone https://github.com/vivsriaus/solutiontemplatevalidation
- npm install
- npm --folder=/path/to/solutiontemplatefolder run mochaTest. For instance,
```
npm --folder=jira-data-center-jira-software run mochaTest
```