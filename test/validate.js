/*global describe, it, beforeEach*/
var assert = require('assert');

const filesFolder = './';
var fs = require('fs');
var path = require('path');
var createUiDefFiles = [];

var read = require('fs-readdir-recursive');
var should = require('should');

var createUiDefFileName = "createuidefinition.json";
var mainTemplateFileName = "maintemplate.json";

// Recursively get all files
var files = read(filesFolder, function(x) {
    return x !== 'node_modules' && x !== '.git' && x !== '.stripped';
});

// Get only create ui def files
var createUiDefFiles = files.filter(function(file) {
    return file.toLowerCase().indexOf(createUiDefFileName) !== -1;
});

// verify directory contains the file
function assertMainTemplateExists(dir) {
    var mainTemplateFile = read(dir).filter(function(file) {
        return file.toLowerCase().indexOf(mainTemplateFileName) !== -1;
    });
    mainTemplateFile.length.should.equals(1, 'there should be exactly one maintemplate file');
}

function getMainTemplateInDir(dir) {
    return read(dir).filter(function(file) {
        return file.toLowerCase().indexOf(mainTemplateFileName) !== -1;
    });
}

describe('createUiDef tests', () => {
    it('must have a schema property', () => {
        createUiDefFiles.forEach(f => {
            var fileString = fs.readFileSync(f, {
                encoding: 'utf8'
            }).trim();
            var fileJSONObject = JSON.parse(fileString);
            fileJSONObject.should.have.property('$schema');
        });
    });

    it('handler must match schema', () => {
        createUiDefFiles.forEach(f => {
            var fileString = fs.readFileSync(f, {
                encoding: 'utf8'
            }).trim();
            var fileJSONObject = JSON.parse(fileString);
            fileJSONObject.should.have.property('handler','Microsoft.Compute.MultiVm');
        });
    });

    it('version must match schema version', () => {
        createUiDefFiles.forEach(f => {
            var fileString = fs.readFileSync(f, {
                encoding: 'utf8'
            }).trim();
            var fileJSONObject = JSON.parse(fileString);
            fileJSONObject.should.have.property('$schema');
            var createUiDefSchemaVersion = fileJSONObject.$schema.match('schema.management.azure.com/schemas/(.*)/CreateUIDefinition')[1]
            fileJSONObject.should.have.property('version', createUiDefSchemaVersion);
        });
    });

    it('each property in the outputs object must have a corresponding parameter in main template', () => {
        createUiDefFiles.forEach(f => {
            var currentDir = path.dirname(f);
            // assert main template exists in the above directory
            assertMainTemplateExists(currentDir);

            // get the corresponding main template
            var mainTemplateFile = path.join(currentDir, getMainTemplateInDir(currentDir)[0]);
            var mainTemplateFileString = fs.readFileSync(mainTemplateFile, {
                encoding: 'utf8'
            }).trim();
            var mainTemplateJSONObject = JSON.parse(mainTemplateFileString);

            // get parameter keys in main template
            var parametersInTemplate = Object.keys(mainTemplateJSONObject.parameters);

            // validate each output in create ui def has a value in parameters
            var createUiDefFileString = fs.readFileSync(f, {
                encoding: 'utf8'
            }).trim();
            var createUiDefJSONObject = JSON.parse(createUiDefFileString);
            createUiDefJSONObject.should.have.property('parameters');
            createUiDefJSONObject.parameters.should.have.property('outputs');
            var outputsInCreateUiDef = Object.keys(createUiDefJSONObject.parameters.outputs);
            outputsInCreateUiDef.forEach(output => {
                parametersInTemplate.should.containEql(output);
            });
        });
    });

    it('all text box controls must have a regex constraint', () => {
        createUiDefFiles.forEach(f => {
            var fileString = fs.readFileSync(f, {
                encoding: 'utf8'
            }).trim();
            var createUiDefJSONObject = JSON.parse(fileString);
            createUiDefJSONObject.should.have.property('parameters');
            createUiDefJSONObject.parameters.should.have.property('basics');
            createUiDefJSONObject.parameters.should.have.property('steps');

            Object.keys(createUiDefJSONObject.parameters.basics).forEach(obj => {
                var val = createUiDefJSONObject.parameters.basics[obj];
                val.should.have.property('type');
                if (val.type.toLowerCase() == 'microsoft.common.textbox') {
                    val.should.have.property('constraints')
                    val.constraints.should.have.property('regex').and.not.empty()
                }
            });

            Object.keys(createUiDefJSONObject.parameters.steps).forEach(obj => {
                var val = createUiDefJSONObject.parameters.steps[obj];
                val.should.have.property('elements');
                Object.keys(val.elements.forEach(elementObj => {
                    if (elementObj.type.toLowerCase() == 'microsoft.common.textbox') {
                    elementObj.should.have.property('constraints')
                    elementObj.constraints.should.have.property('regex').and.not.empty()
                    }
                }));
            });
        });
    });
});