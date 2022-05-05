"use strict";

var _ = require('lodash');
var util = require('./util');

var outFns = {
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

function pickOrOmit(result, input, template) {
  if (input && (template.omit || template.pick)) {
    if (template.pick) {
      var propsPick = _.pick(input, template.pick);
      if (!_.isEmpty(propsPick)) {
        if (result) {
          _.assign(result, propsPick);
        } else {
          result = propsPick;
        }
      }
    }

    if (template.omit) {
      var propsOmit = _.omit(input, template.omit);
      if (!_.isEmpty(propsOmit)) {
        if (result) {
          _.assign(result, propsOmit);
        } else {
          result = propsOmit;
        }
      }
    }
  }
  return result;
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
    if ((paramKey === '' || paramKey === null) && this.options.mode === 'strict') {
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
      var inputCandidate = fn.call(this, input, dataKey);
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
    if ((dataKey === '' || dataKey === null) && this.options.mode === 'strict') {
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
  evaluateValue: function (value, input, parent, params, arrayIndex, arraySize, options, extraParams) {
    var that = this;
    var valueType = (typeof value);
    if (valueType === 'function') {
      return value(input, parent, params, extraParams);
      //if (parent && params) {
      //    return value(input, parent, params);
      //} else {
      //    return value(input);
      //}
    } else if (valueType === 'object') {
      return that.runEngine(value, input, parent, params, arrayIndex, arraySize, options, extraParams);
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
  content: function (template, input, parent, params, arrayIndex, arraySize, options, extraParams) {
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
      var value = that.evaluateValue(contentValue, input, parent, params, arrayIndex, arraySize, options, contentValue.params);
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
              // Object.defineProperty(r, key, {
              //     value:        value,
              //     enumerable:   true,
              //     // writable:     true,
              //     configurable: false
              // });
            }
            hasValue = true;
          }
        }
      }
      return r;
    }, {});
    return hasValue ? result : null;
  },
  timeStamp: function (template, input, parent, params, arrayIndex, arraySize, options) {
    if (!options.dateTime) {
      options.dateTime = new Date();
    }

    if (typeof template.timeStamp.serialize === 'function') {
      return template.timeStamp.serialize(options.dateTime);
    }

    return template.timeStamp.serialize === false ? options.dateTime : options.dateTime.toJSON();
  },
  arrayContent: function (template, input, parent, params, arrayIndex, arraySize, options) {
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
  assign: function (template, input, parent, params, arrayIndex, arraySize, options) {
    var templateAssign = template.assign;
    var that = this;
    if (!Array.isArray(templateAssign) || templateAssign.length === 0 && this.options.mode === 'strict') {
      throw new Error("assign is an array and cannot be empty " + JSON.stringify(templateAssign, null, 2));
    }
    var assignValues = templateAssign.reduce(function (r, assignValue) {
      var v = that.evaluateValue(assignValue, input, parent, params, arrayIndex, arraySize, options);
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
  firstOf: function (template, input, parent, params, arrayIndex, arraySize, options) {
    var templateFirstOf = template.firstOf;
    if (!Array.isArray(templateFirstOf) || templateFirstOf.length === 0 && this.options.mode === 'strict') {
      throw new Error("firstOf is an array and cannot be empty " + JSON.stringify(templateFirstOf, null, 2));
    }

    for (var i = 0; i < templateFirstOf.length; ++i) {
      var t = templateFirstOf[i];
      var value = this.evaluateValue(t, input, parent, params, arrayIndex, arraySize, options);
      if (!_.isNil(value)) {
        return value;
      }
    }
    return null;
  },
  constant: function (template, input) {
    return template.constant;
  },
  value: function (template, input, parent, params, arrayIndex, arraySize, options) {
    var templateValue = template.value;

    return _.isPlainObject(templateValue) ? _.get(templateValue, input) : this.evaluateValue(templateValue, input, parent, params, arrayIndex, arraySize, options, template.params);
  },
  template: function (template, input, parent, params, arrayIndex, arraySize, options) {
    var templateValue = template.template;
    if (Array.isArray(templateValue) && this.options.mode === 'strict') {
      throw new Error("template is an object, not an array " + JSON.stringify(templateValue, null, 2));
    }
    if (_.isEmpty(templateValue) && this.options.mode === 'strict') {
      throw new Error("template is an object and cannot be empty " + JSON.stringify(templateValue, null, 2));
    }

    return this.evaluateValue(templateValue, input, parent, params, arrayIndex, arraySize, options);
  },
  arrayIndex: function (template, input, parent, params, arrayIndex, arraySize) {
    return this.evaluateArrayIndex(arrayIndex, template.arrayIndex);
  },
  runForArray: function (template, input, parent, params, options) {
    var modifiedTemplate = this.actionKeys.reduce(function (r, actionKey) {
      // dataTransform tags only apply to the array
      if (template[actionKey]) {
        r[actionKey] = template[actionKey];
      }
      return r;
    }, _.pick(template, ['pick', 'omit', 'params']));

    var that = this;
    var index = 0;
    var arrSize = input.length;
    var result = input.reduce(function (r, e) {
      var value = that.runEngine(modifiedTemplate, e, parent, params, index++, arrSize, options);
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
  runEngine: function (template, input, parent, params, arrayIndex, arraySize, options, extraParams) {
    if (template.skip === true) {
      return null;
    }

    options = options ? options : {};

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
      var newInput = this.evaluateDataKey(template.source === 'parent' ? parent : input, template.dataKey);
      parent = input;
      input = newInput;
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
        input = this.runEngine(template.dataTransform, input, parent, params, undefined, undefined, options);
      } else {
        input = template.dataTransform(input, this.context);
      }
    }

    if ((input !== null) && (input !== undefined) && template.size) {
      var size = this.evaluateSize(input, template) || arraySize;
      if (size) {
        input = size;
      } else {
        input = util.getSize(input);
      }
    }

    var actionKeys = _.filter(this.actionKeys, templateHasKey(template));

    if (actionKeys && actionKeys.length > 1 && this.options.mode === 'strict') {
      throw new Error("More than one actionKeys cannot be present in the template " + JSON.stringify(template, null, 2));
    }

    var output;

    var actionKey = _.find(this.actionKeys, templateHasKey(template));

    if (Array.isArray(input)) {
      if (template.single) {
        input = input[0];
      } else if (actionKey && !util.isObjectType(template.output)) {
        var resultForArray = this.runForArray(template, input, parent, params, options);
        if (resultForArray === null && !util.isNullOrUndefined(template.default)) {
          resultForArray = _.isFunction(template.default) ? template.default(input, parent, params) : template.default;
        }
        output = template.output ? template.output.type || template.output : undefined;
        if (typeof output === 'function') {
          return template.output(resultForArray, input, parent, params);
        } else if (output && outFns[output] && !util.isNullOrUndefined(resultForArray)) {
          return outFns[output](resultForArray, template.output.type ? template.output : {});
        }
        if (Array.isArray(resultForArray) && _.intersection(_.keys(template), this.arrayOptions).length > 0) {
          return util.convertArray(resultForArray, template);
        } else {
          return resultForArray;
        }
      }
    }

    // if (actionKey === 'value' && _.isPlainObject(template[actionKey])) {
    //     console.log("****ALERT****, value cannot be used as a template, it has been removed.");
    // }

    var result = input !== null && actionKey ? this[actionKey](template, input, parent, params, arrayIndex, arraySize, options, extraParams) : input;
    result = pickOrOmit(result, input, template);

    if (result === null && !util.isNullOrUndefined(template.default)) {
      result = _.isFunction(template.default) ? template.default(input, parent, params) : template.default;
    }
    if ((result !== null) && template.multiple) {
      result = [result];
    }

    output = template.output ? template.output.type || template.output : undefined;

    if (typeof output === 'function') {
      return template.output(result, input, parent, params);
    } else if (output && outFns[output] && !util.isNullOrUndefined(result)) {
      return outFns[output](result, template.output.type ? template.output : {});
    } else if (_.isString(result) && _.intersection(_.keys(template), this.stringOptions).length > 0) {
      return util.convertToString(result, template);
    } else if (Array.isArray(result) && _.intersection(_.keys(template), this.arrayOptions).length > 0) {
      return util.convertArray(result, template);
    } else if (_.isNumber(result) && _.intersection(_.keys(template), this.numberOptions).length > 0) {
      return util.convertToNumber(result, template);
    } else if (_.isBoolean(result) && _.intersection(_.keys(template), this.booleanOptions).length > 0) {
      return util.convertToBoolean(result, template);
    } else {
      return result;
    }
  },
  actionKeys: ['content', 'value', 'template', 'arrayIndex', 'assign', 'firstOf', 'constant', 'arrayContent', 'timeStamp'],
  stringOptions: ['split', 'prefix', 'substring', 'suffix', 'upperCase', 'lowerCase'],
  arrayOptions: ['join', 'flatten', 'compact'],
  numberOptions: ['floor', 'ceiling', 'round'],
  booleanOptions: ['reverse'],
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
  result.options = options || { mode: 'strict' };
  return result;
};

exports.run = function (template, input) {
  return exports.instance().run(template, input);
};
