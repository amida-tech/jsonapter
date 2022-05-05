"use strict";

var json2json = require('../index');

var case_0 = require('./test_cases/case-firstOf-0');
var case_1 = require('./test_cases/case-firstOf-1');

describe('firtOf', function () {
  var engine = json2json.instance();

  it('case-firstOf-0: basic', function () {
    var template = case_0.template;
    var n = case_0.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_0.inputs[i]);
      expect(actual).toEqual(case_0.expecteds[i]);
    }
  });

  it('case-firstOf-1: undefined output', function () {
    var template = case_1.template;
    var n = case_1.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_1.inputs[i]);
      expect(actual).toEqual(case_1.expecteds[i]);
    }
  });
});
