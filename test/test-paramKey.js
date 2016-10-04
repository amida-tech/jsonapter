"use strict";

var chai = require('chai');

var json2json = require('../index');

var case_0 = require('./test_cases/case-paramKey-0');
var case_1 = require('./test_cases/case-paramKey-1');
var case_2 = require('./test_cases/case-paramKey-2');
var case_3 = require('./test_cases/case-paramKey-3');

var params = {
    timestamp: "2016-08-24T15:38:07-05:00"
};

var params2 = {
    timestamp2: "2016-08-24T15:38:07-06:00",
    timestamp3: "2016-08-24T15:38:07-07:00"
};

var params3 = {
    mask: true,
    maskCharacter: "#",
    tst: {
        a: {
            b: {
                c: "test"
            }
        }
    }
};

var expect = chai.expect;

describe('paramKey', function () {
    var engine = json2json.instance();

    it('case-paramKey-0: paramKey ', function () {
        var template = case_0.template;
        var n = case_0.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_0.inputs[i], params);
            expect(actual).to.deep.equal(case_0.expecteds[i]);
        }
    });

    it('case-paramKey-1: paramKey ', function () {
        var template = case_1.template;
        var n = case_1.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_1.inputs[i], params);
            expect(actual).to.deep.equal(case_1.expecteds[i]);
        }
    });

    it('case-paramKey-2: paramKey without params', function () {
        var template = case_1.template;
        var n = case_1.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_1.inputs[i]);
            expect(actual).to.deep.equal(null);
        }
    });

    it('case-paramKey-3: paramKey ', function () {
        var template = case_2.template;
        var n = case_2.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(template, case_2.inputs[i], params2);
            expect(actual).to.deep.equal(case_2.expecteds[i]);
        }
    });

    it('case-paramKey-4: paramKey ', function () {
        var templates = case_3.templates;
        var n = case_3.inputs.length;
        for (var i = 0; i < n; ++i) {
            var actual = engine.run(templates[i], case_3.inputs[i], params3);
            expect(actual).to.deep.equal(case_3.expecteds[i]);
        }
    });
});
