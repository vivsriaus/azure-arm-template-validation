/*global describe, it, beforeEach*/
var assert = require('assert');

const filesFolder = './';
var fs = require('fs');
var path = require('path');
var createUiDefFiles = [];

var read = require('fs-readdir-recursive');
var should = require('should');

var createUiDefFileName = "createuidefinition.json";

// Recursively get all files
var files = read(filesFolder, function(x) {
    return x !== 'node_modules' && x !== '.git' && x !== '.stripped';
});

// Get only create ui def files
var createUiDefFiles = files.filter(function(file) {
    return file.toLowerCase().indexOf(createUiDefFileName) !== -1;
});

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
});