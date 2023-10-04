/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export const createGetter = path => {

  const props = path.split('.');

  return (obj) => {
    if (Object.keys(obj).length === 0) {
      return;
    } else {
      let value = obj;

      for (let prop of props) {
        value = value[prop];
      }
      return value;
    }
  };
};

