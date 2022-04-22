/**
 * Array checker
 * @param {Array} arr
 * @return {boolean}
 */
const isArray = (arr) => Array.isArray(arr);

/**
 * Object checker
 * @param {Object} obj
 * @return {boolean}
 */
const isObject = (obj) => obj === Object(obj) && !isArray(obj) && typeof obj !== 'function';

/**
 * Change string to snake case
 * @param {String} str
 * @return {String}
 */
const toSnake = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/**
 * Change string to camel case
 * @param {String} str
 * @return {String}
 */
const toCamel = (str) => str.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase()
  .replace('-', '')
  .replace('_', ''));

/**
 * Change object keys to camel case
 * @param {Object} obj
 * @return {{}|*}
 */
const keysToCamel = (obj) => {
  if (isObject(obj)) {
    const newObj = {};

    Object.keys(obj)
      .forEach((key) => {
        newObj[toCamel(key)] = keysToCamel(obj[key]);
      });

    return newObj;
  } if (isArray(obj)) {
    return obj.map((item) => keysToCamel(item));
  }

  return obj;
};

/**
 * Change object keys to snake case
 * @param {Object} obj
 * @return {{}|*}
 */
const keysToSnake = (obj) => {
  if (isObject(obj)) {
    const newObj = {};

    Object.keys(obj)
      .forEach((key) => {
        newObj[toSnake(key)] = keysToSnake(obj[key]);
      });

    return newObj;
  } if (isArray(obj)) {
    return obj.map((item) => keysToSnake(item));
  }

  return obj;
};

module.exports = {
  keysToCamel,
  keysToSnake,
};
