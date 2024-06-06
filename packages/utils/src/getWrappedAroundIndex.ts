/**
 * Since (a % b) yields a negative outcome for negative a, we need this method in order
 *  to correctly compute wrapped around indices in lists
 * @param {number} index an arbitrary integer
 * @param {number} length a positive integer
 * @returns {number} the non-negative modulo outcome
 */
export default (index: number, length: number) =>
  ((index % length) + length) % length;
