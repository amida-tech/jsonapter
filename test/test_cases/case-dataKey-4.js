"use strict";

var jsonave = require('@amida-tech/jsonave');

exports.template = {
  content: {
    productPrice: {
      dataKey: ['price', jsonave.instance('$.items[0].price')]
    },
    productName: {
      dataKey: 'name'
    }
  }
};

exports.inputs = [];
exports.expecteds = [];

exports.inputs[0] = [{
  name: 'product-0',
  price: 5
}, {
  name: 'product-1',
  items: [{
    price: 8
  }]
}];

exports.expecteds[0] = [{
  productName: 'product-0',
  productPrice: 5
}, {
  productName: 'product-1',
  productPrice: 8
}];
