"use strict";

exports.template = {
    content: {
        name: {
            dataKey: 'name'
        },
        date: {
            dataKey: ['birthDate', 'recordedDate']
        }
    },
    output: function (result, input) {
        var i = 0;
        result.forEach(function (item) {
            item.i = i++;
            item.name = "Mr. " + item.name;
        });
        return result;
    }
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = [{
    name: 'paws',
    birthDate: '2011-08-09'
}];

exports.expecteds[0] = [{
    i: 0,
    name: 'Mr. paws',
    date: '2011-08-09'
}];
