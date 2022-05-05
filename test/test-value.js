"use strict";

var json2json = require('../index');

var case_0 = require('./test_cases/case-value-0');
var case_1 = require('./test_cases/case-value-1');
var case_2 = require('./test_cases/case-value-2');
var case_3 = require('./test_cases/case-value-3');
var case_4 = require('./test_cases/case-value-4');

var _ = require('lodash');

describe('value', function () {
  var engine = json2json.instance();

  it('case-value-0: basic', function () {
    var template = case_0.template;
    var n = case_0.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_0.inputs[i]);
      expect(actual).toEqual(case_0.expecteds[i]);
    }
  });

  it('case-value-0: basic with existsWhen as object', function () {
    var template = case_0.template;
    template.content.prop_b.existsWhen = { type: 'Detailed' };

    var n = case_0.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_0.inputs[i]);
      expect(actual).toEqual(case_0.expecteds[i]);
    }
  });

  it('case-value-1: null array', function () {
    var n = case_1.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(case_1.template, case_1.inputs[i]);
      expect(actual).toEqual(case_1.expecteds[i]);
    }
  });

  it('case-value-2: array with params', function () {
    var actual = engine.run(case_2.template, case_2.input, {
      limit: 1
    });
    expect(actual).toEqual(case_2.expected);
  });

  it('case-value-3: value with lookup', function () {
    var n = case_3.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(case_3.template, case_3.inputs[i]);
      expect(actual).toEqual(case_3.expecteds[i]);
    }
  });

  it('case-value-4: value with extraParams', function () {
    var n = case_4.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(case_4.template, case_4.inputs[i]);
      expect(actual).toEqual(case_4.expecteds[i]);
    }
  });

});
