/**
 * Count the number of integer digits for a given number.
 *
 * @param {Number} x - input number.
 * @returns {Number} - number of integer digits x has. 1234 = 4 but 1234.44 is also 4.
 */
export default (x) => Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
