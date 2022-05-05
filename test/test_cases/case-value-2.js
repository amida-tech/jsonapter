"use strict";

exports.template = {
  value: function (input, parent, params) {
    return (input > params.limit) ? input : null;
  }
};

exports.input = [0, 1, 2];

exports.expected = [2];
