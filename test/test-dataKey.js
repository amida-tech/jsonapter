"use strict";

var chai = require('chai');

var json2json = require('../index');

var case_0 = require('./test_cases/case-dataKey-0');
var case_1 = require('./test_cases/case-dataKey-1');
var case_2 = require('./test_cases/case-dataKey-2');
var case_3 = require('./test_cases/case-dataKey-3');

var expect = chai.expect;

describe('dataKey', function () {
    var engine = json2json.instance();

    it('case-dataKey-0: array dataKey', function () {
        var template = case_0.template;
        var n = case_0.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_0.inputs[i]);
            console.log(JSON.stringify(actual, null, 2));

            expect(actual.occurred).to.be.not.null;
            expect(actual.occurred1).to.be.not.null;
            expect(actual.occurred2).to.be.not.null;
            expect(actual.occurred3).to.be.not.null;
            actual.occurred = actual.occurred1 = actual.occurred2 = actual.occurred3 = undefined;
            actual = JSON.parse(JSON.stringify(actual));

            expect(actual).to.deep.equal(case_0.expecteds[i]);
        }
    });

    it('case-dataKey-1: jsonpath', function () {
        var template = case_1.template;
        var n = case_1.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_1.inputs[i]);
            expect(actual).to.deep.equal(case_1.expecteds[i]);
        }
    });

    it('case-dataKey-2: ', function () {
        var template = case_2.template;
        var n = case_2.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_2.inputs[i]);
            expect(actual).to.deep.equal(case_2.expecteds[i]);
        }
    });

    it('case-dataKey-3: ', function () {
        var template = case_3.template;
        var n = case_3.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_3.inputs[i]);
            // console.log(JSON.stringify(actual, null, 2));
            expect(actual).to.deep.equal(case_3.expecteds[i]);
        }
    });

});
