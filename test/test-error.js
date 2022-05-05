"use strict";

var _ = require('lodash');
// var j2j = bbj2j.instance();
var bbj2j = require('../index');
var j2j = bbj2j.instance();

describe('example error', function () {

  it('More than one actionKeys cannot be present in the template', function () {

    var template = {
      content: {
        dest_a: {
          dataKey: 'a.c'
        }
      },
      arrayContent: []
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('arrayContent is an array and cannot be empty', function () {

    var template = {
      arrayContent: []
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('assign is an array and cannot be empty', function () {

    var template = {
      assign: []
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('content cannot be empty', function () {

    var template = {
      content: {}
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('firstOf is an array', function () {

    var template = {
      firstOf: {}
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('firstOf is an array and cannot be empty', function () {

    var template = {
      firstOf: []
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('content is an object and cannot be empty', function () {

    var template = {
      content: {}
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('content is an object, not an array', function () {

    var template = {
      content: []
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('template is an object, not an array', function () {

    var template = {
      template: []
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('template is an object and cannot be empty', function () {

    var template = {
      template: {}
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('dataKey cannot be an object', function () {

    var template = {
      dataKey: {}
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('dataKey cannot be an empty array', function () {

    var template = {
      dataKey: []
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('dataKey cannot be an empty string', function () {

    var template = {
      dataKey: ''
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('dataKey cannot be null', function () {

    var template = {
      dataKey: null
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('paramKey cannot be object', function () {

    var template = {
      paramKey: {}
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('paramKey cannot be an array', function () {

    var template = {
      paramKey: []
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('paramKey cannot be an empty string', function () {

    var template = {
      paramKey: ''
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  it('paramKey cannot be an null', function () {

    var template = {
      paramKey: null
    };

    try {
      var r = j2j.run(template, {});
    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

});
