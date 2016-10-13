"use strict";

var chai = require('chai');

var json2json = require('../index');

var case_0 = require('./test_cases/case-value-0');
var case_1 = require('./test_cases/case-value-1');
var case_2 = require('./test_cases/case-value-2');
var case_3 = require('./test_cases/case-value-3');

var expect = chai.expect;

describe('value', function () {
    var engine = json2json.instance();

    it('case-value-0: basic', function () {
        var template = case_0.template;
        var n = case_0.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_0.inputs[i]);
            expect(actual).to.deep.equal(case_0.expecteds[i]);
        }
    });

    it('case-value-0: basic with existsWhen as object', function () {
        var template = case_0.template;
        template.content.prop_b.existsWhen = { type: 'Detailed' };

        var n = case_0.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_0.inputs[i]);
            expect(actual).to.deep.equal(case_0.expecteds[i]);
        }
    });

    it('case-value-1: null array', function () {
        var actual = engine.run(case_1.template, case_1.input);
        expect(actual).to.deep.equal(case_1.expected);
    });

    it('case-value-2: array with params', function () {
        var actual = engine.run(case_2.template, case_2.input, {
            limit: 1
        });
        expect(actual).to.deep.equal(case_2.expected);
    });

    it('case-value-3: value with lookup', function () {
        var n = case_3.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(case_3.template, case_3.inputs[i]);
            expect(actual).to.deep.equal(case_3.expecteds[i]);
        }
    });

});
