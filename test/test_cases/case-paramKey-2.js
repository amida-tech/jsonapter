"use strict";

exports.template = {
  arrayContent: [{
    content: {
      created: {
        paramKey: ['timestamp', 'timestamp2']
      }
    }
  }, {
    content: {
      updated: {
        paramKey: 'timestamp3'
      }
    }
  }]
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {};

exports.expecteds[0] = [{
  created: '2016-08-24T15:38:07-06:00'
}, {
  updated: '2016-08-24T15:38:07-07:00'
}];
