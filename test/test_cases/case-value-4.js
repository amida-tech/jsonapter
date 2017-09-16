"use strict";

function parameter(input, parent, root, params, extraParams) {
    return {
        name: extraParams,
        value: input
    };
}

exports.template = {
    arrayContent: [{
        dataKey: 'firstName',
        value: parameter,
        params: 'firstName'
    },
        {
            dataKey: 'lastName',
            value: parameter,
            params: 'lastName'
        },
        {
            dataKey: 'title',
            value: parameter,
            params: 'title'
        }
    ]
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {
    firstName: 'John',
    lastName: 'Smith',
    title: 'Mr'
};

exports.expecteds[0] = [
    {
        name: 'firstName',
        value: 'John'
    },
    {
        name: 'lastName',
        value: 'Smith'
    },
    {
        name: 'title',
        value: 'Mr'
    }
];
