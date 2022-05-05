"use strict";

var mask = function (input, parent, params) {
  return params.mask ? params.maskCharacter : input;
};

exports.templates = [{
  content: {
    value: {
      dataKey: 'a',
      value: mask
    }
  }
}, {
  content: {
    value: {
      dataKey: 'a.b'
    },
    test: {
      paramKey: 'tst'
    }
  }
}];

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {
  a: "b"
};

exports.inputs[1] = {
  a: {
    b: "data"
  }
};

exports.expecteds[0] = {
  value: "#"
};

exports.expecteds[1] = {
  value: "data",
  test: {
    a: {
      b: {
        c: "test"
      }
    }
  }
};
