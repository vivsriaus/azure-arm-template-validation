# Run static validation checks for solution templates

This repository contains mocha tests, that runs static checks against a solution template folder containing mainTemplate.json, createUiDefinition.json and other template artifacts like nested templates, etc.

## Prerequisites

- [Install](https://nodejs.org/en/) nodejs with npm

## Setup

- git clone https://github.com/vivsriaus/solutiontemplatevalidation
- npm install

## Running all tests

To run all tests
- npm --folder=/path/to/solutiontemplatefolder run all. For instance,
```
npm --folder=jira-data-center-jira-software run all
```

## Running createUiDefinition tests

To run just the tests for createUiDefinition.json file
```
npm --folder=jira-data-center-jira-software run createUi
```

## Running template tests

To run just the tests for template files (mainTemplate.json and any nested template json files included in the folder)
```
npm --folder=jira-data-center-jira-software run template
```

## Other miscellaneous files in this repository

buildpackage.zip, Gruntfile.js, CreateBuildPackage.ps1 and SetBranchNameVariable.ps1 files are NOT required to run tests locally. These are files used by an internal VSTS repository to run the mocha tests as part of a CI pipeline, the scope of which is beyond the solution template validation repository.