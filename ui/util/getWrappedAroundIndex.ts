/**
 * Since (a % b) yields a negative outcome for negative a, we need this method in order
 *  to correctly compute wrapped around indices in lists
 * @param {number} i an arbitrary integer
 * @param {number} len a positive integer
 * @returns {number} the non-negative outcome of i modulo blen
 */
export default (i: number, len: number) => ((i % len) + len) % len;
