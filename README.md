# Run static validation checks for solution templates

This repository contains mocha tests, that runs static checks against a solution template folder containing mainTemplate.json, createUiDefinition.json and other template artifacts like nested templates, etc.

## Running all the tests

- git clone https://github.com/vivsriaus/solutiontemplatevalidation
- npm install
- npm --folder=/path/to/solutiontemplatefolder run all. For instance,
```
npm --folder=jira-data-center-jira-software run all
```
- to run just the tests for createUiDefinition.json file
```
npm --folder=jira-data-center-jira-software run createUi
```
- to run just the tests for template files (mainTemplate.json and any nested template json files included in the folder)
```
npm --folder=jira-data-center-jira-software run template
```