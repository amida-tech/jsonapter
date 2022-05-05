"use strict";

var json2json = require('../index');

var case_0 = require('./test_cases/case-arrayContent-0');
var case_1 = require('./test_cases/case-arrayContent-1');
var case_2 = require('./test_cases/case-arrayContent-2');

describe('arrayContent', function () {
  var engine = json2json.instance();

  it('case-arrayContent-0: basic', function () {
    var template = case_0.template;
    var n = case_0.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_0.inputs[i]);
      expect(actual).toEqual(case_0.expecteds[i]);
    }
  });

  it('case-arrayContent-1: null', function () {
    var template = case_1.template;
    var n = case_1.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_1.inputs[i]);
      expect(actual).toBe(case_1.expecteds[i]);
    }
  });

  it('case-arrayContent-2: default', function () {
    var template = case_2.template;
    var n = case_2.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_2.inputs[i]);
      expect(actual).toEqual(case_2.expecteds[i]);
    }
  });
});
