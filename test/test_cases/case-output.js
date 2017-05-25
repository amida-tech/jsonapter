"use strict";

exports.template = {
    output: "object",
    content: {
        items: {
            content: {
                dest_a: { dataKey: "a" },
                dest_a1: { dataKey: "a", output: "string" },
                dest_obj: { dataKey: "str", output: "object" },
                visible: { dataKey: "hidden", output: {type: "boolean", reverse: true} },
                visible1: { dataKey: "hidden1", reverse: true },
                dest_ar: { dataKey: "a", round: true },
                dest_af: { dataKey: "a", floor: true },
                dest_ac: { dataKey: "a", ceiling: true },
                dest_aStr: {dataKey: "a2", output: {type: "string", prefix: "Num ", suffix: "."}},
                dest_bStr: {dataKey: "a1", prefix: "Num ", suffix: "."},
                dest_cStr: {dataKey: "a1", size: {}, output: "string"}
            }
        },
        count: {size: {}, output: {type: "string", prefix: "Total ", suffix: "."}}
    }
};

exports.input = [
    {
        a: 1.2,
        dest_a1: "1.2",
        str: '{"a": "sample"}',
        a1: "1",
        a2: 0,
        hidden: "true",
        hidden1: true
    },
    {
        a: 2.6,
        dest_a1: "2.6",
        a1: "2",
        a2: 2
    },
    {
        a: 3.5,
        a1: "3",
        a2: 3,
        hidden: null,
        hidden1: false
    }
];

exports.expected = {
    items: [
        {
            dest_a: 1.2,
            dest_a1: "1.2",
            dest_ar: 1,
            dest_af: 1,
            dest_ac: 2,
            dest_obj: {
              a: "sample"
            },
            visible: false,
            visible1: false,
            dest_aStr: "Num 0.",
            dest_bStr: "Num 1.",
            dest_cStr: "1"
        },
        {
            dest_a: 2.6,
            dest_a1: "2.6",
            dest_ar: 3,
            dest_af: 2,
            dest_ac: 3,
            visible: true,
            dest_aStr: "Num 2.",
            dest_bStr: "Num 2.",
            dest_cStr: "1"
        },
        {
            dest_a: 3.5,
            dest_a1: "3.5",
            dest_ar: 4,
            dest_af: 3,
            visible: true,
            visible1: true,
            dest_ac: 4,
            dest_aStr: "Num 3.",
            dest_bStr: "Num 3.",
            dest_cStr: "1"
        }
    ],
    count: "Total 3."
};
