function upsertLocalStorage(data) {
  const current = JSON.parse(localStorage.getItem('promptwiz'));

  localStorage.setItem('promptwiz', JSON.stringify({ ...current, ...data }));
}

function getFromLocalStorage(...values) {
  try {
    const current = JSON.parse(localStorage.getItem('promptwiz')) || {};
    const result = (values.length === 1)
      ? current[values[0]]
      : values.reduce((obj, val) => ((obj[val] = current[val]), obj), {});

    return result;
  } catch(error) {
    return (values.length === 1) ? null : {};
  }
}

function deleteFromLocalStorage(...values) {
  const current = JSON.parse(localStorage.getItem('promptwiz')) || {};

  values.forEach((val) => delete current[val]);

  localStorage.setItem('promptwiz', JSON.stringify(current));
}

function snakeToCamelCase(obj) {
  const camelCaseObj = {};

  Object.keys(obj).forEach((key) => {
    const camelCaseKey = key.replace(/([-_][a-z])/g, (group) => {
      return group.toUpperCase().replace('-', '').replace('_', '')
    });

    camelCaseObj[camelCaseKey] = obj[key] || '';
  });

  return camelCaseObj;
}

function camelToSnakeCase(obj) {
  const snakeCaseObj = {};

  Object.keys(obj).forEach((key) => {
    const snakeCaseKey = key.replace(/([A-Z])/g, (group) => {
      return `_${group.toLowerCase()}`;
    });
    
    snakeCaseObj[snakeCaseKey] = obj[key] || null;
  });

  return snakeCaseObj;
}

export default {
  upsertLocalStorage,
  getFromLocalStorage,
  deleteFromLocalStorage,
  snakeToCamelCase,
  camelToSnakeCase,
};
