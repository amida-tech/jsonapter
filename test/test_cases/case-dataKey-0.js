"use strict";

exports.template = {
    content: {
        name: {
            dataKey: 'name',
            output: function(input) {
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            }
        },
        date: {
            dataKey: ['birthDate', 'recordedDate']
        }
    }
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {
    name: 'paws',
    birthDate: '2011-08-09'
};

exports.expecteds[0] = {
    name: 'Paws',
    date: '2011-08-09'
};

exports.inputs[1] = {
    name: 'Paws',
    recordedDate: '2011-09-01'
};

exports.expecteds[1] = {
    name: 'Paws',
    date: '2011-09-01'
};

exports.inputs[2] = {
    name: 'Paws',
    foundDate: '2011-11-01'
};

exports.expecteds[2] = {
    name: 'Paws'
};
