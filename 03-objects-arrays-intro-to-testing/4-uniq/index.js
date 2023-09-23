/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {

  if (arr !== undefined) {
    let setFromArray = new Set(arr);
    // arr.forEach((element) => setFromArray.add(element));
    return Array.from(setFromArray);
  } else {
    return [];
  }
}
