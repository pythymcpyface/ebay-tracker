const encodeObject = (object) => {
  const encodedObject = { ...object };
  Object.keys(object).forEach((key) => {
    if (object[key]) {
      encodedObject[encodeURIComponent(key)] = encodeURIComponent(object[key]);
    }
  });
  return encodedObject;
};

export default {
  encodeObject,
};
