"use strict";

var chai = require('chai');

var json2json = require('../index');

var caseEmptyValues = require('./test_cases/case-pruneValue.js');

var expect = chai.expect;

describe('pruneTest', function () {

    it('Output should not contain emptyString,emptyArray and NaN values', function () {

        var bbj2j = json2json;
        var options;
        options = {pruneValues: ["emptyString", "emptyArray", "NaN"]};
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithPruneOptions);
    });

    it('Output should contain emptyArray BUT Not emptyString and NaN', function () {

        var bbj2j = json2json;
        var options;
        options = {pruneValues: ["emptyString", "NaN"]};
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithEmptyArrays);
    });

    it('Pass empty PruneValue Array. Output should be without expurgation of any values', function () {

        var bbj2j = json2json;
        var options = {pruneValues: []};
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithOutPruneOptions);
    });

    it('Dont pass pruneValues array. Output should be without expurgation of any values', function () {

        var bbj2j = json2json;
        var j2j = bbj2j.instance();
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithOutPruneOptions);
    });

    it('Pass wrong values in pruneValues Array, Output should be without expurgation of any values', function () {

        var bbj2j = json2json;
        var options = {pruneValues: ["whatEver", 1]};
        var j2j = bbj2j.instance(null, null, options);
        var actual = j2j.run(caseEmptyValues.template, caseEmptyValues.input);
        expect(actual).to.deep.equal(caseEmptyValues.expectedWithOutPruneOptions);
    });
});