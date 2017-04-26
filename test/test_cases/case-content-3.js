"use strict";

exports.template = {
    output: "object",
    content: {
        items: {
            content: {
                dest_a: {dataKey: "a"}
                // dest_a: {dataKey: "a", output: "boolean"}
            }
        },
        count: {size: {}, output: "string"}
    }
};

exports.input = [
    {
        a: 0
    },
    {
        a: 2
    },
    {
        a: 3
    }
];

exports.expected = {
    items: [
    {
        dest_a: 0
    },
    {
        dest_a: 2
    },
    {
        dest_a: 3
    }
    ],
    count: 3
};
