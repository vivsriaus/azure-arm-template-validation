var assert = require('assert');
var util = require('./util');

const filesFolder = './';
var fs = require('fs');
var path = require('path');
var read = require('fs-readdir-recursive');
var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

var folder = process.env.npm_config_folder || filesFolder;

var createUiDefFileJSONObject = util.getCreateUiDefFileJSONObject(folder);
var createUiDefFile = util.getCreateUiDefFile(folder);

chai.use(function (_chai, _) {
  _chai.Assertion.addMethod('withMessage', function (msg) {
    _.flag(this, 'message', msg);
  });
});

describe('createUiDef tests', () => {
    it('must have a schema property', () => {
        createUiDefFileJSONObject.should.have.property('$schema');
    });

    it('handler must match schema', () => {
        createUiDefFileJSONObject.should.have.property('handler', 'Microsoft.Compute.MultiVm');
    });

    it('version must match schema version', () => {
        createUiDefFileJSONObject.should.have.property('$schema');
        var createUiDefSchemaVersion = createUiDefFileJSONObject.$schema.match('schema.management.azure.com/schemas/(.*)/CreateUIDefinition')[1]
        createUiDefFileJSONObject.should.have.property('version', createUiDefSchemaVersion);
    });

    it('each property in the outputs object must have a corresponding parameter in main template', () => {
        var currentDir = path.dirname(createUiDefFile);
        // assert main template exists in the above directory
        util.assertMainTemplateExists(currentDir);

        // get the corresponding main template
        var mainTemplateFile = path.join(currentDir, util.getMainTemplateInDir(currentDir)[0]);
        var mainTemplateFileString = fs.readFileSync(mainTemplateFile, {
            encoding: 'utf8'
        }).trim();
        var mainTemplateJSONObject = JSON.parse(mainTemplateFileString);

        // get parameter keys in main template
        var parametersInTemplate = Object.keys(mainTemplateJSONObject.parameters);

        // validate each output in create ui def has a value in parameters
        createUiDefFileJSONObject.should.have.property('parameters');
        createUiDefFileJSONObject.parameters.should.have.property('outputs');
        var outputsInCreateUiDef = Object.keys(createUiDefFileJSONObject.parameters.outputs);
        outputsInCreateUiDef.forEach(output => {
            parametersInTemplate.should.containEql(output);
        });
    });

    it('all text box controls must have a regex constraint', () => {
        createUiDefFileJSONObject.should.have.property('parameters');
        createUiDefFileJSONObject.parameters.should.have.property('basics');
        createUiDefFileJSONObject.parameters.should.have.property('steps');

        Object.keys(createUiDefFileJSONObject.parameters.basics).forEach(obj => {
            var val = createUiDefFileJSONObject.parameters.basics[obj];
            val.should.have.property('type');
            if (val.type.toLowerCase() == 'microsoft.common.textbox') {
                val.should.have.property('constraints');
                val.constraints.should.have.property('regex').and.not.empty();
            }
        });

        Object.keys(createUiDefFileJSONObject.parameters.steps).forEach(obj => {
            var val = createUiDefFileJSONObject.parameters.steps[obj];
            val.should.have.property('elements');
            Object.keys(val.elements.forEach(elementObj => {
                if (elementObj.type.toLowerCase() == 'microsoft.common.textbox') {
                    elementObj.should.have.property('constraints');
                    //expect(elementObj.constraints, 'elementObj at line number ').to.have.property('regex');
                    elementObj.constraints.should.have.property('regex').and.not.empty();
                }
            }));
        });
    });

    it('location must be in outputs, and should match [location()]', () => {
        createUiDefFileJSONObject.should.have.property('parameters');
        createUiDefFileJSONObject.parameters.should.have.property('outputs');
        createUiDefFileJSONObject.parameters.outputs.should.have.property('location', '[location()]');
    });
});