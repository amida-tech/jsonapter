"use strict";

var _ = require('lodash');

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
    evaluateParamKey: function (input, paramKey, params) {
        if (Array.isArray(paramKey)) {
            return this.paramKeyArrayToInput(params, paramKey);
        } else {
            return this.paramKeyToInput(params, paramKey, params);
        }
    },
    evaluateValue: function (value, input, params) {
        var valueType = (typeof value);
        if (valueType === 'function') {
            return value(input);
        } else if (valueType === 'object') {
            return this.run(value, input, params);
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
    content: function (template, input, params) {
        var that = this;
        var content = template.content;
        var hasValue = false;
        var keys = Object.keys(content);
        var result = keys.reduce(function (r, key) {
            var contentValue = template.content[key];
            var value = that.evaluateValue(contentValue, input, params);
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
    arrayContent: function (template, input, params) {
        var that = this;
        var content = template.arrayContent;
        var result = content.reduce(function (r, e) {
            var value = that.evaluateValue(e, input, params);
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
    assign: function (template, input, params) {
        var templateAssign = template.assign;
        var that = this;
        var assignValues = templateAssign.reduce(function (r, assignValue) {
            var v = that.evaluateValue(assignValue, input, params);
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
    firstOf: function (template, input, params) {
        var templateFirstOf = template.firstOf;
        for (var i = 0; i < templateFirstOf.length; ++i) {
            var t = templateFirstOf[i];
            var value = this.evaluateValue(t, input, params);
            if (value !== null) {
                return value;
            }
        }
        return null;
    },
    constant: function (template, input) {
        return template.constant;
    },
    value: function (template, input, params) {
        var templateValue = template.value;
        return this.evaluateValue(templateValue, input, params);
    },
    runForArray: function (template, input) {
        var hasActionKeys = false;
        var modifiedTemplate = this.actionKeys.reduce(function (r, actionKey) {
            // dataTransform tags only apply to the array
            if (template[actionKey]) {
                r[actionKey] = template[actionKey];
                hasActionKeys = true;
            }
            return r;
        }, {});
        if (!hasActionKeys) {
            return input;
        }
        var that = this;
        var result = input.reduce(function (r, e) {
            var value = that.run(modifiedTemplate, e);
            if (value !== null) {
                r.push(value);
            }
            return r;
        }, []);
        if (result.length > 0) {
            return result;
        } else {
            return null;
        }
    },
    evaluateExistsWhen: function (template, input) {
        var existsWhen = template.existsWhen;

        if (existsWhen) {
            if (Array.isArray(existsWhen)) {
                return existsWhen.every(function (ew) {
                    return ew(input);
                });
            } else {
                return existsWhen(input);
            }
        }
        return true;
    },
    evaluateExistsUnless: function (template, input) {
        var existsUnless = template.existsUnless;
        if (existsUnless) {
            if (Array.isArray(existsUnless)) {
                return existsUnless.every(function (ew) {
                    return ew(input);
                });
            } else {
                return existsUnless(input);
            }
        }
        return false;
    },
    run: function (template, input, params) {
        if (!this.evaluateExistsWhen(template, input)) {
            return null;
        }
        if (this.evaluateExistsUnless(template, input)) {
            return null;
        }
        if ((input !== null) && (input !== undefined) && template.dataKey) {
            input = this.evaluateDataKey(input, template.dataKey);
        }
        if ((input !== null) && (input !== undefined) && template.paramKey && params) {
            input = this.evaluateParamKey(input, template.paramKey, params);
        }
        if ((input !== null) && template.dataTransform) {
            input = template.dataTransform(input, this.context);
        }
        if (Array.isArray(input)) {
            if (template.single) {
                input = input[0];
            } else {
                var resultForArray = this.runForArray(template, input);
                if (resultForArray === null && (template.default !== null && template.default !== undefined)) {
                    resultForArray = template.default;
                }
                return resultForArray;
            }
        }
        var result = input;
        if (input !== null) {
            for (var i = 0; i < this.actionKeys.length; ++i) {
                var actionKey = this.actionKeys[i];
                if (template.hasOwnProperty(actionKey)) {
                    result = this[actionKey](template, input, params);
                    break;
                }
            }
        }
        if (result === null && (template.default !== null && template.default !== undefined)) {
            result = template.default;
        }
        if ((result !== null) && template.multiple) {
            result = [result];
        }
        return result;
    },
    actionKeys: ['content', 'value', 'assign', 'firstOf', 'constant', 'arrayContent'],
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
