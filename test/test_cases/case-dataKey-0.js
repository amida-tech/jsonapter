"use strict";

exports.template = {
    content: {
        name: {
            dataKey: 'name',
            output: function (result, input) {
                return result.substring(0, 1).toUpperCase() + result.substring(1);
            }
        },
        nickNames: { dataKey: "nickNames", split: { separator: /\s+/ } },
        city: { dataKey: "city", trim: true, lowerCase: true },
        state: { dataKey: "state", trim: true, upperCase: true },
        child: { dataKey: "adult", reverse: true },
        salary: { dataKey: "salary", output: "number" },
        date: {
            dataKey: ['birthDate', 'recordedDate']
        },
        year: {
            dataKey: ['birthDate', 'recordedDate'],
            substring: { start: 0, end: 4 }
        },
        occurred: { timeStamp: { serialize: false } },
        occurred1: { timeStamp: {} },
        occurred2: {
            timeStamp: {
                serialize: function (value) {
                    return 'Date:' + value.toJSON();
                }
            }
        },
        occurred3: { timeStamp: { serialize: false }, output: "string" }
    }
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {
    name: 'paws',
    nickNames: 'cat kittie cattie',
    city: 'DALLAS',
    state: 'tx',
    birthDate: '2011-08-09',
    adult: true,
    salary: "500"
};

exports.expecteds[0] = {
    name: 'Paws',
    city: 'dallas',
    nickNames: ['cat', 'kittie', 'cattie'],
    state: 'TX',
    child: false,
    date: '2011-08-09',
    year: '2011',
    salary: 500
};

exports.inputs[1] = {
    name: 'Paws',
    city: 'dallas',
    state: 'tx',
    adult: false,
    recordedDate: '2012-09-01'
};

exports.expecteds[1] = {
    name: 'Paws',
    city: 'dallas',
    state: 'TX',
    child: true,
    date: '2012-09-01',
    year: '2012'
};

exports.inputs[2] = {
    name: 'Paws',
    city: 'dallas',
    state: 'TX',
    foundDate: '2011-11-01'
};

exports.expecteds[2] = {
    name: 'Paws',
    city: 'dallas',
    state: 'TX'
};
