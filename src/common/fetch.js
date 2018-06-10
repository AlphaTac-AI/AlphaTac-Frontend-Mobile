/* eslint-disable global-require */
let newFetch = window.fetch;
// if (process.env.MOCK === 'true') {
const mock = require('../mock').default;
newFetch = (url, options) => {
  if (mock[url]) return Promise.resolve(mock[url]);
  return window.fetch(url, options);
};
// }

const fetch = newFetch;
export default fetch;
