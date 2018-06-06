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
    pick: ['eyeColor', 'hairColor']
};

exports.inputs = [{
    lastName: 'Doe',
    firstName: 'Joe',
    birthYear: 2000,
    eyeColor: 'blue',
    hairColor: 'brown'
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

exports.expecteds = [{
    fullName: 'Joe Doe',
    age: 15,
    eyeColor: 'blue',
    hairColor: 'brown'
}, {
    fullName: 'Joe Doe',
    age: 15,
    hairColor: 'brown'
}, {
    hairColor: 'brown'
}, {
    eyeColor: 'blue',
    hairColor: 'brown'
}];
