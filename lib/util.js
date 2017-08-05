/**
 * Created by gdev on 4/11/2017.
 */
var _ = require('lodash');

function isNullOrUndefined(input) {
    return input === null || input === undefined;
}

function getSize(input) {
    if (_.isArray(input) || _.isString(input)) {
        return input.length;
    } else if (_.isPlainObject(input)) {
        return _.keys(input).length;
    }
}

function checkType(input, type) {
    return input && (input === type || input.type === type);
}

function isObjectType(input) {
    return checkType(input, 'object');
}

/**

function isStringType(input) {
    return checkType(input, 'string');
}

function isBooleanType(input) {
    return checkType(input, 'boolean');
}
function isArrayType(input) {
    return checkType(input, 'array');
}
**/

function applyStringFormat(input, options) {
    var result = input;
    if (options.trim) {
        result = result.trim();
    }

    if (options.substring) {
        var start = options.substring.start ? options.substring.start : 0;
        var end = options.substring.end ? options.substring.end : null;
        result = end ? result.substring(start, end) : result.substring(start);
    }

    if (options.upperCase) {
        result = result.toUpperCase();
    } else if (options.lowerCase) {
        result = result.toLowerCase();
    }

    return (options.prefix || '') + result + (options.suffix || '');
}

function convertToString(input, options) {
    var type = typeof input;
    var result = input;

    if (_.isDate(input)) {
        result = input.toJSON();
    } else if (_.isPlainObject(input) || Array.isArray(input)) {
        result = JSON.stringify(input);
    } else if (type === 'boolean' || type === 'number') {
        result = '' + input;
    }

    if (options.split) {
        result = result.split(options.split.separator ? options.split.separator : /\s+/);
    }

    if (Array.isArray(result)) {
        result = result.reduce(function (r, val) {
            r.push(applyStringFormat(val, options));
            return r;
        }, []);
    } else {
        result = applyStringFormat(result, options);
    }
    return result;
}

function convertArray(result, options) {
    if (options.join) {
        return _.join(result, options.join.separator);
    } else if (options.compact) {
        return _.compact(result);
    } else if (options.flatten) {
        return options.flatten.deep ? _.flattenDeep(result) : _.flatten(result);
    }
}

function convertToObject(input, options) {
    if (typeof input === 'string') {
        return JSON.parse(input);
    } else {
        return input;
    }
}

function convertToNumber(input, options) {
    var num = parseFloat(input);
    if (options.round) {
        return Math.round(num);
    } else if (options.floor) {
        return Math.floor(num);
    } else if (options.ceiling) {
        return Math.ceil(num);
    }
    return num;
}

function convertToBoolean(input, options) {
    if (typeof input === 'boolean') {
        return options.reverse ? !input : input;
    }
    // if (isNullOrUndefined(input)) {
    //     return options.reverse ? true : false;
    // }
    if (typeof input === 'string') {
        input = input.toUpperCase();
        if (input === "" || input === 'FALSE') {
            return options.reverse ? true : false;
        }
    }
    if (typeof input === 'number') {
        return options.reverse ? input <= 0 : input > 0;
    }

    return options.reverse ? false : true;
}

module.exports = {
    getSize: getSize,
    // isStringType: isStringType,
    isObjectType: isObjectType,
    // isBooleanType: isBooleanType,
    convertToString: convertToString,
    convertArray: convertArray,
    convertToBoolean: convertToBoolean,
    convertToNumber: convertToNumber,
    convertToObject: convertToObject,
    isNullOrUndefined: isNullOrUndefined
};