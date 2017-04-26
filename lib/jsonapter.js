"use strict";

var _ = require('lodash');
var util = require('./util');

var outFns =  {
   string: util.convertToString,
   boolean: util.convertToBoolean,
   number: util.convertToNumber,
   object: util.convertToObject
};


function templateHasKey(template) {
    return function (key) {
        return template.hasOwnProperty(key);
    };
}

var prototype = {
    dataKeyToInput: function (input, dataKey) {
        if (typeof dataKey === 'function') {
            return dataKey(input, this.context);
        } else {
            return _.get(input, dataKey, null);
        }
    },
    paramKeyToInput: function (params, paramKey) {
        if ((Array.isArray(paramKey) || _.isPlainObject(paramKey)) && this.options.mode === 'strict') {
            throw new Error("paramKey can only be a string " + paramKey);
        }
        if ((paramKey === '' || paramKey  === null) && this.options.mode === 'strict') {
            throw new Error("paramKey can not be an empty string or null " + paramKey);
        }
        return _.get(params, paramKey, null);
    },
    genericKeyArrayToInput: function (input, keyArray, fn) {
        if (keyArray.length === 0 && this.options.mode === 'strict') {
            throw new Error("If dataKey/paramKey is an array it cannot be empty " + keyArray);
        }

        var n = keyArray.length;
        for (var i = 0; i < n; ++i) {
            var dataKey = keyArray[i];
            var inputCandidate = fn(input, dataKey);
            if ((inputCandidate !== null) && (inputCandidate !== undefined)) {
                return inputCandidate;
            }
        }
        return null;
    },
    dataKeyArrayToInput: function (input, dataKeyArray) {
        return this.genericKeyArrayToInput(input, dataKeyArray, this.dataKeyToInput);
    },
    paramKeyArrayToInput: function (input, paramKeyArray) {
        return this.genericKeyArrayToInput(input, paramKeyArray, this.paramKeyToInput);
    },
    evaluateDataKey: function (input, dataKey) {
        // var type = typeof dataKey;
        if (_.isPlainObject(dataKey) && this.options.mode === 'strict') {
            throw new Error("dataKey can be a string, array or function " + dataKey);
        }
        if ((dataKey === '' || dataKey  === null) && this.options.mode === 'strict') {
            throw new Error("dataKey can not be an empty string or null " + dataKey);
        }
        if (Array.isArray(dataKey)) {
            return this.dataKeyArrayToInput(input, dataKey);
        } else {
            return this.dataKeyToInput(input, dataKey);
        }
    },
    evaluateArrayIndex: function (index, arrayIndex) {
        return arrayIndex.start > 0 ? index + arrayIndex.start : index;
    },
    evaluateSize: function (input, template) {
        if (template.dataKey) {
            return util.getSize(input);
        }
    },
    evaluateParamKey: function (input, paramKey, parent, params) {
        if (Array.isArray(paramKey)) {
            return this.paramKeyArrayToInput(params, paramKey);
        } else {
            return this.paramKeyToInput(params, paramKey, params);
        }
    },
    evaluateValue: function (value, input, parent, params, arrayIndex, arraySize) {
        var valueType = (typeof value);
        if (valueType === 'function') {
            return value(input, parent, params);
            //if (parent && params) {
            //    return value(input, parent, params);
            //} else {
            //    return value(input);
            //}
        } else if (valueType === 'object') {
            return this.runEngine(value, input, parent, params, arrayIndex, arraySize);
        } else {
            return value;
        }
    },
    validatePruneValue: function (value) {
        if (_.isString(value) && _.isEmpty(value)) {
            return "emptyString";
        }
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return "emptyArray";
            }
        }
        if (_.isNaN(value)) {
            return "NaN";
        }
        return null;
    },
    content: function (template, input, parent, params, arrayIndex, arraySize) {
        var that = this;
        var content = template.content;
        if (Array.isArray(content) && this.options.mode === 'strict') {
            throw new Error("content is an object, not an array " + JSON.stringify(content, null, 2));
        }
        if (_.isEmpty(content) && this.options.mode === 'strict') {
            throw new Error("content is an object and cannot be empty " + JSON.stringify(content, null, 2));
        }
        var hasValue = false;
        var keys = Object.keys(content);
        var result = keys.reduce(function (r, key) {
            var contentValue = template.content[key];
            var value = that.evaluateValue(contentValue, input, parent, params, arrayIndex, arraySize);
            if (value !== null) {
                if (!that.options.pruneValues || !Array.isArray(that.options.pruneValues)) {
                    if (template.ignoreDeep) {
                        r[key] = value;
                    } else {
                        _.set(r, key, value);
                    }
                    hasValue = true;
                } else {
                    var expr = that.validatePruneValue(value);
                    if (!_.includes(that.options.pruneValues, expr) || (content[key].default !== null && content[key].default !== undefined)) {
                        if (template.ignoreDeep) {
                            r[key] = value;
                        } else {
                            _.set(r, key, value);
                        }
                        hasValue = true;
                    }
                }
            }
            return r;
        }, {});
        return hasValue ? result : null;
    },
    arrayContent: function (template, input, parent, params, arrayIndex, arraySize) {
        var that = this;
        var templatearrayContent = template.arrayContent;
        if (!Array.isArray(templatearrayContent) || templatearrayContent.length === 0 && this.options.mode === 'strict') {
            throw new Error("arrayContent is an array and cannot be empty " + JSON.stringify(templatearrayContent, null, 2));
        }

        var result = templatearrayContent.reduce(function (r, e) {
            var value = that.evaluateValue(e, input, parent, params, arrayIndex, arraySize);
            if (value !== null) {
                if (Array.isArray(value)) {
                    Array.prototype.push.apply(r, value);
                } else {
                    r.push(value);
                }
            }
            return r;
        }, []);
        return result.length ? result : null;
    },
    assign: function (template, input, parent, params, arrayIndex, arraySize) {
        var templateAssign = template.assign;
        var that = this;
        if (!Array.isArray(templateAssign) || templateAssign.length === 0 && this.options.mode === 'strict') {
            throw new Error("assign is an array and cannot be empty " + JSON.stringify(templateAssign, null, 2));
        }
        var assignValues = templateAssign.reduce(function (r, assignValue) {
            var v = that.evaluateValue(assignValue, input, parent, params, arrayIndex, arraySize);
            if ((v !== null) && (typeof v === 'object')) {
                r.push(v);
            }
            return r;
        }, [{}]);
        if (assignValues.length === 1) {
            return null;
        }
        var v = _.assign.apply(null, assignValues);
        return v;
    },
    firstOf: function (template, input, parent, params, arrayIndex, arraySize) {
        var templateFirstOf = template.firstOf;
        if (!Array.isArray(templateFirstOf) || templateFirstOf.length === 0 && this.options.mode === 'strict') {
            throw new Error("firstOf is an array and cannot be empty " + JSON.stringify(templateFirstOf, null, 2));
        }

        for (var i = 0; i < templateFirstOf.length; ++i) {
            var t = templateFirstOf[i];
            var value = this.evaluateValue(t, input, parent, params, arrayIndex, arraySize);
            if (value !== null) {
                return value;
            }
        }
        return null;
    },
    constant: function (template, input) {
        return template.constant;
    },
    value: function (template, input, parent, params, arrayIndex, arraySize) {
        var templateValue = template.value;
        if (template.lookup === true) {
            return template.dataKey ? _.get(templateValue, input) : templateValue;
        } else {
            return this.evaluateValue(templateValue, input, parent, params, arrayIndex, arraySize);
        }
    },
    template: function (template, input, parent, params, arrayIndex, arraySize) {
        var templateValue = template.template;
        if (Array.isArray(templateValue) && this.options.mode === 'strict') {
            throw new Error("template is an object, not an array " + JSON.stringify(templateValue, null, 2));
        }
        if (_.isEmpty(templateValue) && this.options.mode === 'strict') {
            throw new Error("template is an object and cannot be empty " + JSON.stringify(templateValue, null, 2));
        }

        return this.evaluateValue(templateValue, input, parent, params, arrayIndex, arraySize);
    },
    arrayIndex : function (template, input, parent, params, arrayIndex, arraySize) {
        return this.evaluateArrayIndex(arrayIndex, template.arrayIndex);
    },
    runForArray: function (template, input, parent, params) {
        var modifiedTemplate = this.actionKeys.reduce(function (r, actionKey) {
            // dataTransform tags only apply to the array
            if (template[actionKey]) {
                r[actionKey] = template[actionKey];
            }
            return r;
        }, {});
        if (_.isEmpty(modifiedTemplate)) {
            return input;
        }
        var that = this;
        var index = 0;
        var arrSize = input.length;
        var result = input.reduce(function (r, e) {
            var value = that.runEngine(modifiedTemplate, e, parent, params, index++, arrSize);
            if (value !== null) {
                r.push(value);
            }
            return r;
        }, []);

        return result.length === 0 ? null : result;
    },
    evaluateExistsWhen: function (template, input, params) {
        var existsWhen = template.existsWhen;

        if (existsWhen) {
            if (Array.isArray(existsWhen)) {
                return existsWhen.every(function (ew) {
                    return _.isFunction(ew) ? (ew(input) || ew(params)) : (_.iteratee(ew)(input) || _.iteratee(ew)(params));
                });
            } else {
                return _.isFunction(existsWhen) ? (existsWhen(input) || existsWhen(params)) : (_.iteratee(existsWhen)(input) || _.iteratee(existsWhen)(params));
            }
        }
        return true;
    },
    evaluateExistsUnless: function (template, input, params) {
        var existsUnless = template.existsUnless;
        if (existsUnless) {
            if (Array.isArray(existsUnless)) {
                return existsUnless.every(function (ew) {
                    return _.isFunction(ew) ? (ew(input) || ew(params)) : (_.iteratee(ew)(input) || _.iteratee(ew)(params));
                });
            } else {
                return _.isFunction(existsUnless) ? (existsUnless(input) || existsUnless(params)) : (_.iteratee(existsUnless)(input) || _.iteratee(existsUnless)(params));
            }
        }
        return false;
    },
    evaluateExistsEither: function (template, input, params) {
        var existsEither = template.existsEither;

        if (Array.isArray(existsEither)) {
            return existsEither.some(function (exEith) {
                return _.isFunction(exEith) ? (exEith(input) || exEith(params)) : (_.iteratee(exEith)(input) || _.iteratee(exEith)(params));
            });
        }
        return true;
    },
    run: function (template, input, params) {
        return this.runEngine(template, input, null, params);
    },
    runEngine: function (template, input, parent, params, arrayIndex, arraySize) {
        if (template.skip === true) {
            return null;
        }
        if (!this.evaluateExistsWhen(template, input, params)) {
            return null;
        }
        if (!this.evaluateExistsEither(template, input, params)) {
            return null;
        }
        if (this.evaluateExistsUnless(template, input, params)) {
            return null;
        }
        if ((input !== null) && (input !== undefined) && template.hasOwnProperty('dataKey')) {
            parent = input;
            input = this.evaluateDataKey(input, template.dataKey);
        }
        if ((input !== null) && (input !== undefined) && template.size) {
            var size = this.evaluateSize(input, template) || arraySize;
            if (size) {return size;}
            if (arraySize) {return arraySize;}
            return util.getSize(input);
        }
        if ((input !== null) && (input !== undefined) && template.hasOwnProperty('paramKey')) {
            parent = input;
            input = this.evaluateParamKey(input, template.paramKey, parent, params || {});
        }
        if ((input !== null) && template.dataTransform) {
            parent = input;
            if (_.isString(template.dataTransform)) {
                input = input[template.dataTransform];
            } else if (_.isPlainObject(template.dataTransform)) {
                input = this.runEngine(template.dataTransform, input, parent, params);
            } else {
                input = template.dataTransform(input, this.context);
            }
        }

        var actionKeys = _.filter(this.actionKeys, templateHasKey(template));

        if (actionKeys && actionKeys.length > 1 && this.options.mode === 'strict') {
            throw new Error("More than one actionKeys cannot be present in the template " + JSON.stringify(template, null, 2));
        }

        if (Array.isArray(input)) {
            if (template.single) {
                input = input[0];
            } else if (!util.isObjectType(template.output)) {
                var resultForArray = this.runForArray(template, input, parent, params);
                if (resultForArray === null && !util.isNullOrUndefined(template.default)) {
                    resultForArray = _.isFunction(template.default) ? template.default(input, parent, params) : template.default;
                }
                return resultForArray;
            }
        }

        var actionKey = _.find(this.actionKeys, templateHasKey(template));

        var result = input !== null && actionKey ? this[actionKey](template, input, parent, params, arrayIndex, arraySize) : input;

        if (result === null && !util.isNullOrUndefined(template.default)) {
            result = _.isFunction(template.default) ? template.default(input, parent, params) : template.default;
        }
        if ((result !== null) && template.multiple) {
            result = [result];
        }

        var output = template.output ? template.output.type || template.output : undefined;

        if (typeof output === 'function') {
            return template.output(result, input, parent, params);
        } else if (output) {
            return outFns[output](result);
        } else {
            return result;
        }
    },
    actionKeys: ['content', 'value', 'template', 'arrayIndex', 'assign', 'firstOf', 'constant', 'arrayContent'],
    context: {}
};

exports.instance = function (overrides, addlActionKeys, options) {
    var result = Object.create(prototype);
    if (overrides) {
        _.assign(result, overrides);
    }
    if (addlActionKeys) {
        result.actionKeys = result.actionKeys.concat(addlActionKeys);
    }
    result.options = options || {mode: 'strict'};
    return result;
};
