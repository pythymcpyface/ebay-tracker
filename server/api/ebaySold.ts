import axios from 'axios';
import * as cheerio from 'cheerio';

const getEbaySoldResults = (params) => {
  const {
    item,
    category,
    condition,
  } = params;
  const soldUrl = 'https://www.ebay.co.uk/sch/i.html';
  const ebayParams = {
    _from: 'R40',
    _nkw: item,
    _sacat: category,
    LH_Complete: 1,
    LH_Sold: 1,
    _ipg: 60,
    _sop: 10,
    LH_ItemCondition: condition,
  };

  return axios.get(soldUrl, { params: ebayParams })
    .then((response) => {
      return response;
    }).catch((error) => {
      return error;
    });
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { data } = await getEbaySoldResults(query);
  const $ = cheerio.load(data);
  const priceElements = Array.from($('.s-item__price').find('.POSITIVE'))
    .map((price) => price.children?.at(0)?.data);
  return { data: priceElements };
});
