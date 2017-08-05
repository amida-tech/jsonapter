"use strict";
var _ = require('lodash');

var cmap = {
  a: "x",
  b: "y",
  c: "z"
};

exports.template = {
    content: {
        prop_s: {
            dataKey: 'st', join: {separator: "~"}
        },
        prop_sa: {
            dataKey: 'st', value: cmap, join: {separator: "~"}
        },
        prop_sb: {
            dataKey: 'sta', compact: true
        },
        type: 'Testable',
        prop_a: {
            dataKey: 'a.b.c'
        },
        prop_b: {
            value: function (input) {
                return '_' + input + '_';
            },
            dataKey: 'a.d'
        },
        prop_c: function (input) {
            return Object.keys(input).length;
        },
        'prop_d.deep': {
            dataKey: 'a.e'
        },
        prop_missing: {
            dataKey: 'a.xx'
        },
        prop_default: {
            content: {
                missing: {
                    dataKey: 'a.yy'
                }
            },
            default: 'default value'
        },
        prop_ss: {
            dataKey: 'stt', flatten: {}
        },
        prop_ss_deep: {
            dataKey: 'stt', flatten: {deep: true}
        }
    },
    ignoreDeep: true
};

exports.input = {
    a: {
        b: {
            c: 'value_0'
        },
        d: 'value_1',
        e: {
            ea: 'value_2',
            eb: 'value_3'
        }
    },
    f: 'last',
    st: ["a", "b", "c"],
    sta: ["a", "b", "c", null, '', undefined],
    stt: [
        [{namea: "a"}],
        [[{nameb: "b"}]],
        [{namec: "c"}]
    ]
};

exports.expected = {
    type: 'Testable',
    prop_a: 'value_0',
    prop_b: '_value_1_',
    prop_c: 5,
    'prop_d.deep': {
        ea: 'value_2',
        eb: 'value_3'
    },
    prop_s: "a~b~c",
    prop_sa: "x~y~z",
    prop_sb: ["a", "b", "c"],
    prop_ss: [
        {namea: "a"},
        [
            {nameb: "b"}
        ],
        {namec: "c"}
    ],
    prop_ss_deep: [
        {namea: "a"},
        {nameb: "b"},
        {namec: "c"}
    ],
    prop_default: 'default value'
};
