"use strict";

var json2json = require('../index');

var case_0 = require('./test_cases/case-omit-0');

describe('omit', function () {
  it('case-omit-0: basic', function () {
    var template = case_0.template;
    var n = case_0.inputs.length;
    for (var i = 0; i < n; ++i) {
      var actual = json2json.run(template, case_0.inputs[i]);
      expect(actual).toEqual(case_0.expecteds[i]);
    }
  });
});
