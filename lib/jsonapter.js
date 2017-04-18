"use strict";

var _ = require('lodash');
var util = require('./util');

var prototype = {
    dataKeyToInput: function (input, dataKey) {
        if (typeof dataKey === 'function') {
            return dataKey(input, this.context);
        } else {
            return _.get(input, dataKey, null);
        }
    },
    paramKeyToInput: function (params, paramKey) {
        return _.get(params, paramKey, null);
    },
    genericKeyArrayToInput: function (input, keyArray, fn) {
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
        var content = template.arrayContent;
        var result = content.reduce(function (r, e) {
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
        if ((input !== null) && (input !== undefined) && template.dataKey) {
            parent = input;
            input = this.evaluateDataKey(input, template.dataKey);
        }
        if ((input !== null) && (input !== undefined) && template.size) {
            var size = this.evaluateSize(input, template) || arraySize;
            if (size) {return size;}
            if (arraySize) {return arraySize;}
            return util.getSize(input);
        }
        if ((input !== null) && (input !== undefined) && template.paramKey) {
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

        if (Array.isArray(input) && !(template.output === 'object' || typeof template.output === 'object') ) {
            if (template.single) {
                input = input[0];
            } else {
                var resultForArray = this.runForArray(template, input, parent, params);
                if (resultForArray === null && !util.isNullOrUndefined(template.default)) {
                    resultForArray = _.isFunction(template.default) ? template.default(input, parent, params) : template.default;
                }
                return resultForArray;
            }
        }

        var result = input;
        if (input !== null) {
            for (var i = 0; i < this.actionKeys.length; ++i) {
                var actionKey = this.actionKeys[i];
                if (template.hasOwnProperty(actionKey)) {
                    result = this[actionKey](template, input, parent, params, arrayIndex, arraySize);
                    break;
                }
            }
        }

        if (result === null && !util.isNullOrUndefined(template.default)) {
            result = _.isFunction(template.default) ? template.default(input, parent, params) : template.default;
        }
        if ((result !== null) && template.multiple) {
            result = [result];
        }

        return result;
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
    result.options = options || {};
    return result;
};
