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

  if (size === undefined) {
    return string;
  } else {
    return characterSeparator(arrayFromString, size);
  }
}

function characterSeparator(arrayFromString, size) {
  let counter = 0;
  let param = arrayFromString[counter];
  let duplicateCharCounter = 0;
  let copyArray = [];


  do {
    if (duplicateCharCounter < size) {
      copyArray.push(param);
      duplicateCharCounter++;
      counter++;
    } else {
      duplicateCharCounter++;
      counter++;
    }

    if (arrayFromString[counter] !== param) {
      param = arrayFromString[counter];
      duplicateCharCounter = 0;
    }
  } while (counter < arrayFromString.length);

  return copyArray.join('');
}






