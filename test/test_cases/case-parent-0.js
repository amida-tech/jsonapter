"use strict";

var jsonave = require('@amida-tech/jsonave').instance;
var _ = require('lodash');

exports.template = {
  dataKey: "data",
  template: {
    dataKey: "address",
    content: {
      company: { dataKey: "company", source: "parent" },
      street: { dataKey: "street" },
      city: { dataKey: "city" },
      state: { dataKey: "state" },
      zip: { dataKey: "zip" }
    }
  }
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {
  data: {
    company: "Google",
    address: {
      street: "1600 Amphitheatre Parkway",
      city: "Mountain View",
      state: "CA",
      zip: 94043
    }
  }
};

exports.expecteds[0] = {
  company: "Google",
  street: "1600 Amphitheatre Parkway",
  city: "Mountain View",
  state: "CA",
  zip: 94043
};
