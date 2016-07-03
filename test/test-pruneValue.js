"use strict";

var chai = require('chai');

var json2json = require('../index');

var caseEmptyValues = require('./test_cases/case-pruneValue.js');

var expect = chai.expect;

describe('pruneTest', function () {

    it('Output SHOULD NOT contain ANY emptyString,emptyArray and NaN values', function () {

        var bbj2j = json2json;
        var options;
        options = {
            pruneValues: ["emptyString", "emptyArray", "NaN"]
        };
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithPruneOptions);
    });

    it('Output SHOULD contain emptyArray BUT NOT emptyString and NaN values', function () {

        var bbj2j = json2json;
        var options;
        options = {
            pruneValues: ["emptyString", "NaN"]
        };
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithEmptyArrays);
    });

    it('Output SHOULD contain emptyString BUT NOT emptyArray and NaN values', function () {

        var bbj2j = json2json;
        var options;
        options = {
            pruneValues: ["emptyArray", "NaN"]
        };
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.templateToMapGeneralInput, caseEmptyValues.generalInputToTestMultipleTestCases);
        expect(actual).to.deep.equal(caseEmptyValues.outputForEmptyStringPresence);
    });

    it('Output SHOULD contain NaN BUT NOT emptyArray and emptyString values', function () {

        var bbj2j = json2json;
        var options;
        options = {
            pruneValues: ["emptyArray", "emptyString"]
        };
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.templateToMapGeneralInput, caseEmptyValues.generalInputToTestMultipleTestCases);
        expect(actual).to.deep.equal(caseEmptyValues.outputForNaNPresence);
    });

    it('Output SHOULD contain emptyString,emptyArray and NaN values Because we passed Defaults for All Those', function () {

        var bbj2j = json2json;
        var options;
        options = {
            pruneValues: ["emptyString", "emptyArray", "NaN"]
        };
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.templateForDefaultValues, caseEmptyValues.generalInputToTestMultipleTestCases);
        console.log(JSON.stringify(actual));
        expect(actual).to.deep.equal(caseEmptyValues.outputForDefaultValues);
    });

    it('Pass empty PruneValue Array. Output SHOULD be without expurgation of any values', function () {

        var bbj2j = json2json;
        var options = {
            pruneValues: []
        };
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithOutPruneOptions);
    });

    it('Dont pass pruneValues array. Output SHOULD be without expurgation of any values', function () {

        var bbj2j = json2json;
        var j2j = bbj2j.instance();
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithOutPruneOptions);
    });

    it('Pass wrong values in pruneValues Array, Output SHOULD be without expurgation of any values', function () {

        var bbj2j = json2json;
        var options = {
            pruneValues: ["whatEver", 1]
        };
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithOutPruneOptions);
    });
});
