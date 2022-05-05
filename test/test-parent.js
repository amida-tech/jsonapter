"use strict";

var json2json = require('../index');

var case_0 = require('./test_cases/case-parent-0');
var case_1 = require('./test_cases/case-parent-1');
var case_2 = require('./test_cases/case-parent-2');

var _ = require('lodash');

describe('parent', function () {
  var engine = json2json.instance();

  it('case-parent-0: ', function () {
    var template = case_0.template;
    var n = case_0.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_0.inputs[i]);
      console.log(JSON.stringify(actual, null, 2));
      expect(actual).toEqual(case_0.expecteds[i]);
    }
  });

  it('case-parent-1: ', function () {
    var template = case_0.template;
    var n = case_0.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_0.inputs[i]);
      // console.log(actual);
      expect(actual).toEqual(case_0.expecteds[i]);
    }
  });

  it('case-parent-2: ', function () {
    var template = case_2.template;
    var n = case_2.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = engine.run(template, case_2.inputs[i]);
      // console.log(actual);
      expect(actual).toEqual(case_2.expecteds[i]);
    }
  });

});
