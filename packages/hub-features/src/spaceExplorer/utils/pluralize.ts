/**
 * Simple english pluralization, obviously doesn't cover any edge cases
 * see https://stackoverflow.com/questions/27194359/javascript-pluralize-an-english-string
 * @param {Number} count to be displayed
 * @param {String} noun of the item
 * @param {Suffix} suffix for plural
 * @returns pluralized word
 */
export const pluralize = (count: number, noun: string, suffix = "s") => {
  const countDisplay = isNaN(count) ? "" : `${count} `;
  const suffixDisplay = count === 1 ? "" : suffix;
  return `${countDisplay}${noun}${suffixDisplay}`;
};
