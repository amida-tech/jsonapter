"use strict";

var jsonave = require('@amida-tech/jsonave').instance;
var _ = require('lodash');

exports.template = {
  content: {
    actors: {
      dataKey: "companies",
      template: {
        dataKey: "users",
        content: {
          name: { dataKey: "name" },
          age: { dataKey: "age" },
          company: { dataKey: "company", source: "parent" }
        }
      },
      flatten: true
    }
  }
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = {
  companies: [{
    company: "Google",
    users: [{
      name: "John",
      age: 30
    }, {
      name: "Jim",
      age: 40
    }]
  },
  {
    company: "Yahoo",
    users: [{
      name: "Jim",
      age: 32
    }, {
      name: "Tom",
      age: 50
    }]
  }
  ]
};

exports.expecteds[0] = {
  actors: [{
    name: "John",
    age: 30,
    company: "Google"
  },
  {
    name: "Jim",
    age: 40,
    company: "Google"
  },
  {
    name: "Jim",
    age: 32,
    company: "Yahoo"
  },
  {
    name: "Tom",
    age: 50,
    company: "Yahoo"
  }
  ]
};
