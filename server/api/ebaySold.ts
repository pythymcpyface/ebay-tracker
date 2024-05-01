import axios from 'axios';
import * as cheerio from 'cheerio';
import utils from '../../utils';

const getEbaySoldResults = (params) => {
  Object.keys(params).forEach((key) => {
    if (!params[key]) {
      delete params[key];
    }
  });
  const {
    item,
    category,
    condition,
  } = params;
  const marketplace = params?.marketplace || 'com';
  const soldUrl = `https://www.ebay.${marketplace}/sch/i.html`;

  const uris = Array(5).fill(0).map((_, i) => {
    const ebayParams = {
      _from: 'R40',
      _nkw: item,
      _sacat: category,
      LH_Complete: 1,
      LH_Sold: 1,
      _ipg: 240,
      _sop: 10,
      LH_ItemCondition: condition,
      _pgn: i + 1,
      ...params,
    };
    const ebayParamsEncoded = utils.encodeObject(ebayParams);
    return axios.getUri({ url: soldUrl, params: ebayParamsEncoded });
  });

  return axios.all(uris.map((uri) => axios.get(uri, {
    paramsSerializer(params) {
      let result = '';
      // Build the query string
      return result;
    },
  }))).then((data) => {
    return data;
  }).catch((error) => {
    return error;
  });
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const responses = await getEbaySoldResults(query);
  const priceElements = responses[0].data;
  let _priceElements = [];
  if (responses instanceof Array) {
    _priceElements = responses?.map((response) => {
      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        return Array.from($('.s-item__price').find('.POSITIVE'))
          .map((price) => {
            return price.children?.at(0)?.data;
          });
      }
    }).flat();
  }
  return { data: _priceElements };
});
