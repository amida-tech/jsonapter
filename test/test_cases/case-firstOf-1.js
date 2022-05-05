"use strict";

exports.template = {
  content: {
    item: {
      firstOf: [{
        value: function (input) {
          if (input.startsWith('a')) {
            return input + ' 1st';
          }
        }
      }, {
        value: function (input) {
          if (input.startsWith('b')) {
            return input + ' 2nd';
          }
        }
      }, {
        value: function (input) {
          if (input.startsWith('c')) {
            return input + ' 3rd';
          }
        }
      }]
    }
  },
  dataKey: 'prop'
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = { prop: 'and' };
exports.inputs[1] = { prop: 'but' };
exports.inputs[2] = { prop: 'cal' };

exports.expecteds[0] = { item: 'and 1st' };
exports.expecteds[1] = { item: 'but 2nd' };
exports.expecteds[2] = { item: 'cal 3rd' };
