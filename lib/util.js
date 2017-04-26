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

function isStringType(input) {
    return checkType(input, 'string');
}

function isObjectType(input) {
    return checkType(input, 'object');
}

function isBooleanType(input) {
    return checkType(input, 'boolean');
}
function isArrayType(input) {
    return checkType(input, 'array');
}

function convertToString(input) {
    var type = typeof input;

    if (type === 'object') {
        return JSON.stringify(input);
    } else if (type === 'boolean' || type === 'number') {
        return '' + input;
    }
}

function convertToObject(input) {
    if (typeof input === 'object') {
        return input;
    } else if (typeof input === 'string') {
        return JSON.parse(input);
    } else {
        return input;
    }
}

function convertToNumber(input) {
    return parseFloat(input);
}

function convertToBoolean(input) {
    if (typeof input === 'boolean') {
        return input;
    }
    if (isNullOrUndefined(input)) {
        return false;
    }
    if (typeof input === 'string') {
        input = input.toUpperCase();
        if (input === "" || input === 'FALSE') {
            return false;
        }
    }
    if (typeof input === 'number') {
        return input > 0;
    }

    return true;
}

module.exports = {
    getSize: getSize,
    isStringType: isStringType,
    isObjectType: isObjectType,
    isBooleanType: isBooleanType,
    convertToString: convertToString,
    convertToBoolean: convertToBoolean,
    convertToNumber: convertToNumber,
    convertToObject: convertToObject,
    isNullOrUndefined: isNullOrUndefined
};