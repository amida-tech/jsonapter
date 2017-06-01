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
    output: "string"
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = [{
    name: 'paws',
    birthDate: '2011-08-09'
}];

exports.expecteds[0] = "[{\"name\":\"paws\",\"date\":\"2011-08-09\"}]";
