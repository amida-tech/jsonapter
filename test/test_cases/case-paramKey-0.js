"use strict";

exports.template = {
  content: {
    created: {
      paramKey: 'timestamp'
    },
    updated: {
      paramKey: 'timestamp'
    }
  }
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {};

exports.inputs[1] = [{
  a: "b"
}];

exports.expecteds[0] = {
  created: '2016-08-24T15:38:07-05:00',
  updated: '2016-08-24T15:38:07-05:00'
};

exports.expecteds[1] = [{
  created: '2016-08-24T15:38:07-05:00',
  updated: '2016-08-24T15:38:07-05:00'
}];
