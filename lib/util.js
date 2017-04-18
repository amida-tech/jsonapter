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

module.exports = {
        getSize: getSize,
        isNullOrUndefined: isNullOrUndefined
};