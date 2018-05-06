"use strict";

exports.template = {
    value: function (input, parent, params, extraParams) {
        return (input > extraParams) ? input - extraParams : null;
    },
    params: 50
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = [0, 1, 2];
exports.inputs[1] = [50, 51, 52];

exports.expecteds[0] = null;
exports.expecteds[1] = [1, 2];
