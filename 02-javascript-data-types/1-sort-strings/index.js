/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

  switch (param) {
  case 'asc':
    return makeSorting(arr);
  case 'desc':
    let reverseArray = makeSorting(arr);
    return reverseArray.reverse();
  }
}

function makeSorting(arr) {
  let collator = new Intl.Collator(['ru', 'en'], {caseFirst: 'upper'});

  return [...arr].sort((a, b) => collator.compare(a, b));
}
