const filesFolder = './';
var fs = require('fs');
var path = require('path');

var read = require('fs-readdir-recursive');
var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

var createUiDefFileName = "createuidefinition.json";
var mainTemplateFileName = "maintemplate.json";

// Recursively get all files
// var files = read(filesFolder, function(x) {
//     return x !== 'node_modules' && x !== '.git' && x !== '.stripped';
// });

// var files = fs.readdirSync(filesFolder);
// console.log(files);

function getFiles(folder, fileType) {
    return fs.readdirSync(folder).filter(function(file) {
        return file.toLowerCase().indexOf(fileType) !== -1;
    });
}

// Get create ui def file
exports.getCreateUiDefFile = function getCreateUiDefFile(folder) {
    var createUiDefFiles = getFiles(folder, createUiDefFileName);
    createUiDefFiles.length.should.equals(1, 'Only one createUiDefinition.json file should exist, but found ' + createUiDefFiles.length + ' file(s)');
    return path.resolve(folder, createUiDefFiles[0]);
};

exports.getCreateUiDefFileJSONObject = function getCreateUiDefFileJSONObject(folder) {
    var createUiDefFiles = getFiles(folder, createUiDefFileName);
    createUiDefFiles.length.should.equals(1, 'Only one createUiDefinition.json file should exist, but found ' + createUiDefFiles.length + ' file(s)');
    var fileString = fs.readFileSync(path.resolve(folder, createUiDefFiles[0]), {
            encoding: 'utf8'
        }).trim();
    return JSON.parse(fileString);
};

var createUiDefFileJSONObject = function() {
    var fileString = fs.readFileSync(getCreateUiDefFile(), {
            encoding: 'utf8'
        }).trim();
    return JSON.parse(fileString);
};

// Get only main template files
exports.getMainTemplateFile = function getMainTemplateFile() {
    var mainTemplateFiles = getFiles(mainTemplateFileName);
    mainTemplateFiles.length.should.equals(1, 'Only one mainTemplate.json file should exist');
    return mainTemplateFiles[0];
};

// verify directory contains the file
exports.assertMainTemplateExists = function assertMainTemplateExists(dir) {
    var mainTemplateFile = read(dir).filter(function(file) {
        return file.toLowerCase().indexOf(mainTemplateFileName) !== -1;
    });
    mainTemplateFile.length.should.equals(1, 'Only one mainTemplate.json file should exist, but found ' + mainTemplateFile.length + ' files(s)');
}

// gets path to mainTemplate.json in given directory
exports.getMainTemplateInDir = function getMainTemplateInDir(dir) {
    return read(dir).filter(function(file) {
        return file.toLowerCase().indexOf(mainTemplateFileName) !== -1;
    });
}