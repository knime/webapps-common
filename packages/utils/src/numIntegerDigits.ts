/**
 * Count the number of integer digits for a given number.
 *
 * @param input number.
 * @returns number of integer digits x has. 1234 = 4 but 1234.44 is also 4.
 */
export default (input: number) =>
  Math.max(Math.floor(Math.log10(Math.abs(input))), 0) + 1;
