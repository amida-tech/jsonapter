"use strict";

exports.template = {
  content: {
    fullName: {
      value: function (input) {
        return input.firstName + ' ' + input.lastName;
      },
      existsWhen: ['firstName', 'lastName']
    },
    age: {
      value: function (input) {
        return 2015 - input;
      },
      dataKey: 'birthYear'
    }
  },
  omit: ['eyeColor', 'lastName', 'firstName', 'birthYear']
};

exports.inputs = [{
  lastName: 'Doe',
  firstName: 'Joe',
  birthYear: 2000,
  eyeColor: 'blue',
  hairColor: 'brown',
  weight: 242,
}, {
  lastName: 'Doe',
  firstName: 'Joe',
  birthYear: 2000,
  hairColor: 'brown'
}, {
  hairColor: 'brown'
}, {
  eyeColor: 'blue',
  hairColor: 'brown'
}];

exports.inputs.push(exports.inputs.slice());

exports.expecteds = [{
  fullName: 'Joe Doe',
  age: 15,
  hairColor: 'brown',
  weight: 242,
}, {
  fullName: 'Joe Doe',
  age: 15,
  hairColor: 'brown'
}, {
  hairColor: 'brown'
}, {
  hairColor: 'brown'
}];

exports.expecteds.push(exports.expecteds.slice());
