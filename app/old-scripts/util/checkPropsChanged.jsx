const _ = require('lodash')

/**
 * Shallow compares both objects on certain properties to see if they are
 * unequal. AKA: returns true if any of the given props are different between
 * the two objects.
 * @param  {Object} object1  First object to compare
 * @param  {Object} object2  Second object to compare
 * @param  {[type]} ...props All the properties to check for
 * @return {Boolean}         true if any of the given props are different
 *                           between the two objects, false if they are the
 *                           same
 */
module.exports = (object1, object2, ...props) => {
  if (!_.isObject(object1) || !_.isObject(object2)) {
    throw new Error('First two arguments must be objects')
  }

  for (const prop of props) {
    if (!_.isEqual(object1[prop], object2[prop])) return true
  }

  return false
}
