"use strict";

var chai = require('chai');

var json2json = require('../index');

var case_output = require('./test_cases/case-output');
var case_output1 = require('./test_cases/case-output-1');

var expect = chai.expect;

describe('output', function () {
    var engine = json2json.instance();

    it('case-output-1: array output as object', function () {
        var actual = engine.run(case_output.template, case_output.input);
        expect(actual).to.deep.equal(case_output.expected);
    });

    it('case-output-2: array output as object', function () {
        case_output.template.output = { type: "object" };
        var actual = engine.run(case_output.template, case_output.input);
        expect(actual).to.deep.equal(case_output.expected);
    });

    it('case-output-3: object as string', function () {
        var actual = engine.run(case_output1.template, case_output1.input);
        expect(actual).to.deep.equal('{"firstName":"John","lastName":"Smith"}');
    });

});
