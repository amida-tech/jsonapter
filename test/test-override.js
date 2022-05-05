"use strict";

var json2json = require('../index');

var case_0 = require('./test_cases/case-override-0');

describe('content', function () {
  var override = {
    people: [],
    external: function (template, input) {
      var templateValue = template.external;
      var external = this.run(templateValue, input);
      if (external !== null) {
        this.people.push(external);
        return this.people.length - 1;
      } else {
        return null;
      }
    }
  };

  var engine = json2json.instance(override, ['external']);

  it('case-coverride-0: basic', function () {
    var actual = engine.run(case_0.template, case_0.input);
    expect(actual).toEqual(case_0.expected);
    expect(override.people).toHaveLength(2);
    expect(override.people).toEqual([{
      lastName: 'DOE',
      firstName: 'JOE'
    }, {
      lastName: 'DOE',
      firstName: 'JANE'
    }]);
  });
});
