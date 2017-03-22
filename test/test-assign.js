"use strict";

var chai = require('chai');
var debug = require('debug')('debug');

var json2json = require('../index');

var case_0 = require('./test_cases/case-assign-0');
var case_1 = require('./test_cases/case-assign-1');
var case_2 = require('./test_cases/case-assign-2');
var case_3 = require('./test_cases/case-assign-3');

var expect = chai.expect;

describe('assign', function () {
    var engine = json2json.instance();

    it('case-assign-0: basic', function () {
        var actual = engine.run(case_0.template, case_0.input);
        expect(actual).to.deep.equal(case_0.expected);
    });

    it('case-assign-1: null returning', function () {
        var actual = engine.run(case_1.template, case_1.input);
        expect(actual).to.equal(case_1.expected);
    });

    it('case-assign-2: split', function () {
        var actual = engine.run(case_2.template, case_2.input);
        expect(actual).to.deep.equal(case_2.expected);
    });

    it('case-assign-3: array', function () {
        var actual = engine.run(case_3.template, case_3.input);
        debug(JSON.stringify(actual, null, 2));
        expect(actual).to.deep.equal(case_3.expected);
    });

});
