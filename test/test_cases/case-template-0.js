"use strict";

var nestedTemplate = {
    value: function (input) {
        return input.toUpperCase();
    },
    dataKey: 'b.name'
};

exports.template = {
    template: nestedTemplate,
    dataKey: 'a'
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {
    a: {
        b: {
            name: 'Joe'
        }
    }
};

exports.expecteds[0] = "JOE";
