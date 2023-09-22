/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} [arr=[]] arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr = [], param = 'asc') {
  let collator = new Intl.Collator(['ru', 'en'], {caseFirst: 'upper'});
  const direction = param === 'asc' ? 1 : -1;

  return makeSorting(arr, direction, collator);
}

function makeSorting(arr, direction = 1, collator) {
  return [...arr].sort((a, b) => direction * collator.compare(a, b));
}

