"use strict";

exports.template = {
    arrayContent: [{
        content: {
            created: {
                paramKey: 'timestamp'
            }
        }
    }, {
        content: {
            updated: {
                paramKey: 'timestamp'
            }
        }
    }]
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {};

exports.expecteds[0] = [{
    created: '2016-08-24T15:38:07-05:00'
}, {
    updated: '2016-08-24T15:38:07-05:00'
}];
