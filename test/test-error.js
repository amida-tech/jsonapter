"use strict";

var chai = require('chai');

var expect = chai.expect;
var _ = require('lodash');
// var j2j = bbj2j.instance();
var bbj2j = require('../index');
// var j2j = bbj2j.instance(null, null, {mode: ""});
var j2j = bbj2j.instance();

describe('example error', function () {

    it('dataKey - error', function () {

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
            expect(err).to.exist;
        }
    });
});