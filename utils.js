const calculateMinutesRemaining = (endDateString) => {
  const nowMilliseconds = new Date().getTime();
  const parsedEndDate = Date.parse(endDateString);
  const endDateMilliseconds = endDateString ? parsedEndDate : -1;
  return Math.round((endDateMilliseconds - nowMilliseconds) / (60 * 10)) / 100;
};

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
  calculateMinutesRemaining,
  encodeObject,
};
