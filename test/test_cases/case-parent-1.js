"use strict";

var jsonave = require('jsonave').instance;
var _ = require('lodash');

exports.template = {
    content: {
        stuff: {
            dataKey: 'a1',
            template: {
                dataKey: jsonave('a2[:].a_inner'),
                content: {
                    x_new: {
                        dataKey: "x_outer",
                        source: "parent",
                        value: function (input, parent) {
                            console.log(input, parent);
                            return 2 * input;
                        },
                        floor: true
                    },
                    a_new: {}
                }
            },
            flatten: true
        }
    }
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {
    a1: [{
        x_outer: 1.1,
        y_outer: 2,
        z_outer: 3,
        a2: [{
            a_inner: 4,
            b_inner: 5,
            c_inner: 6
        }, {
            a_inner: 7,
            b_inner: 8,
            c_inner: 9
        }]
    }, {
        x_outer: 10.4,
        y_outer: 11,
        z_outer: 12,
        a2: [{
            a_inner: 13,
            b_inner: 14,
            c_inner: 15
        }, {
            a_inner: 16,
            b_inner: 17,
            c_inner: 18
        }]
    }]
};

exports.expecteds[0] = {
    stuff: [{
        x_new: 2,
        a_new: 4
    }, {
        x_new: 2,
        a_new: 7
    }, {
        x_new: 20,
        a_new: 13
    }, {
        x_new: 20,
        a_new: 16
    }]
};
