var assert = require('assert');
var util = require('./util');
const filesFolder = './';
var path = require('path');
var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

var folder = process.env.npm_config_folder || filesFolder;

var mainTemplateFileJSONObject = util.getMainTemplateFile(folder).jsonObject;
var mainTemplateFile = util.getMainTemplateFile(folder).file;
var createUiDefFileJSONObject = util.getCreateUiDefFile(folder).jsonObject;
var createUiDefFile = util.getCreateUiDefFile(folder).file;

chai.use(function (_chai, _) {
  _chai.Assertion.addMethod('withMessage', function (msg) {
    _.flag(this, 'message', msg);
  });
});

function getErrorMessage(obj, message) {
    return 'json object with \'name\' at line number ' + util.getPosition(obj, mainTemplateFile) + message;
}

describe('mainTemplate tests', () => {
    describe('mainTemplate parameters tests', () => {
        it('each parameter that does not have a defaultValue, must have a corresponding output in createUIDef', () => {
            var currentDir = path.dirname(mainTemplateFile);
            // assert create ui def exists in the above directory
            util.assertCreateUiDefExists(currentDir);

            // get the corresponding create ui def
            var createUiDefJSONObject = util.getCreateUiDefFile(currentDir).jsonObject;

            // get output keys in main template
            var outputsInCreateUiDef = Object.keys(createUiDefJSONObject.parameters.outputs);

            // validate each parameter in main template has a value in outputs
            mainTemplateFileJSONObject.should.have.property('parameters');
            var parametersInMainTemplate = Object.keys(mainTemplateFileJSONObject.parameters);
            parametersInMainTemplate.forEach(parameter => {
                if(!mainTemplateFileJSONObject.parameters[parameter].defaultValue) {
                    outputsInCreateUiDef.should.withMessage('outputs in createUiDefinition is missing the parameter ' + parameter).contain(parameter);
                }
            });
        });
        
        // TODO: should it be non null, or should all secure strings not contain default value?
        it('non-null default values must not be provided for secureStrings', () => {
            Object.keys(mainTemplateFileJSONObject.parameters).forEach(parameter => {
                if(mainTemplateFileJSONObject.parameters[parameter].type.toLowerCase()=='securestring') {
                    // get default value if one exists
                    var defaultVal = mainTemplateFileJSONObject.parameters[parameter].defaultValue;
                    if(defaultVal && defaultVal.length > 0) {
                        expect(mainTemplateFileJSONObject.parameters[parameter], parameter + ' should not have defaultValue').to.not.have.property('defaultValue');
                    }
                }
            });
        });

        // TODO: should location prop in resources all be set to param('location') ?
        it('a parameter named "location" must exists and must be used on all resource "location" properties', () => {
            mainTemplateFileJSONObject.should.have.property('parameters');
            mainTemplateFileJSONObject.parameters.should.have.property('location');

            // TODO: if location default value exists, it should be set to resourceGroup.location(). Correct?

            // each resource location should be "location": "[parameters('location')]"
            var expectedLocation = '[parameters(\'location\')]';
            var message = ' should have location set to [parameters(\'location\')]';
            Object.keys(mainTemplateFileJSONObject.resources).forEach(resource => {
                var val = mainTemplateFileJSONObject.resources[resource];
                if(val.location) {
                    val.location.should.withMessage(getErrorMessage(val, message)).be.eql(expectedLocation);
                }
            });
        });

        it('the template must not contain any unused parameters', () => {
            mainTemplateFileJSONObject.should.have.property('parameters');
            var parametersInMainTemplate = Object.keys(mainTemplateFileJSONObject.parameters);
            parametersInMainTemplate.forEach(parameter => {
                var paramString = 'parameters(\'' + parameter + '\')';
                JSON.stringify(mainTemplateFileJSONObject).should.withMessage('unused parameter ' + parameter + ' in mainTemplate').contain(paramString);
            });
        });
    });

    describe('mainTemplate resources tests', () => {
        it('resourceGroup().location must not be used in the solution template except as a defaultValue for the location parameter', () => {
            mainTemplateFileJSONObject.should.have.property('resources');
            var locationString = '[resourceGroup().location]';
            var message = ' should NOT have location set to [resourceGroup().location]';
            Object.keys(mainTemplateFileJSONObject.resources).forEach(resource => {
                var val = mainTemplateFileJSONObject.resources[resource];
                if(val.location) {
                    val.location.should.withMessage(getErrorMessage(val, message)).not.be.eql(locationString);
                }
            });
        });

        it('apiVersions must NOT be retrieved using providers().apiVersions[n].  This function is non-deterministic', () => {
            mainTemplateFileJSONObject.should.have.property('resources');
            var message = ' should NOT have api version determined by providers().';
            Object.keys(mainTemplateFileJSONObject.resources).forEach(resource => {
                var val = mainTemplateFileJSONObject.resources[resource];
                if(val.apiVersion) {
                    val.apiVersion.should.withMessage(getErrorMessage(val, message)).not.contain('providers(');
                }
            });
        });

        it('template must contain only approved resources (Compute/Network/Storage)', () => {
            mainTemplateFileJSONObject.should.have.property('resources');
            var message = ' is NOT a compute, network or a storage resource type';
            Object.keys(mainTemplateFileJSONObject.resources).forEach(resource => {
                var val = mainTemplateFileJSONObject.resources[resource];
                if(val.type) {
                    var rType = val.type.split('/');
                    var cond = rType[0].toLowerCase() == 'microsoft.compute' ||
                        rType[0].toLowerCase() == 'microsoft.storage' ||
                        rType[0].toLowerCase() == 'microsoft.network';
                    expect(cond, getErrorMessage(val, message)).to.be.true;
                }
            });
        });
    });
});