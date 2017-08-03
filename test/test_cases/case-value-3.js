"use strict";

exports.template = {
    content: {
        name: { dataKey: 'name' },
        title: {
            dataKey: 'gender',
            value: {
                M: 'Mr',
                F: 'Ms'
            },
            default: "Mr"
        }
    }
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {
    name: 'John',
    gender: 'M'
};

exports.inputs[1] = {
    name: 'John'
};

exports.expecteds[0] = {
    name: 'John',
    title: 'Mr'
};

exports.expecteds[1] = {
    name: 'John',
    title: 'Mr'
};
