/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  let arrayFromString = string.split('');
  let counter = 0;
  let copyArray = [];

  return recursion(arrayFromString, copyArray, counter, size);
}

function recursion(arrayFromString, copyArray, counter, size) {
  const param = arrayFromString[counter];
  let duplicateCharCounter = 0;

  do {
    if (duplicateCharCounter < size) {
      copyArray.push(param);
      duplicateCharCounter++;
      counter++;
    } else {
      duplicateCharCounter++;
      counter++;
    }
  } while (arrayFromString[counter] === param);

  if (counter + 1 === arrayFromString.length) {
    debugger;
    return copyArray;
  } else {
    return recursion(arrayFromString, copyArray, counter, size);
  }
}




