/* eslint-disable camelcase */
import axios from 'axios';
import { defineEventHandler, useSession } from 'h3';

const ebayLiveResults = (params, token, buyingOption, sort) => {
  Object.keys(params).forEach((key) => {
    if (!params[key]) {
      delete params[key];
    }
  });
  const {
    item,
    category,
    condition,
    marketplace,
  } = params;
  const headers = {
    Authorization: `Bearer ${token}`,
    'X-EBAY-C-MARKETPLACE-ID': marketplace,
  };

  const aspects = { ...params };
  delete aspects.item;
  delete aspects.category;
  delete aspects.buyingOption;
  delete aspects.condition;
  delete aspects.marketplace;

  aspects.categoryId = category;
  aspects.conditionDistributions = condition;

  const aspectsBraced = { ...aspects };
  Object.keys(aspects).forEach((key) => {
    aspectsBraced[key] = `{${aspects[key]}}`;
  });

  const aspectsString = JSON.stringify(aspectsBraced).replace(/"/g, '');
  const newAspectsString = aspectsString.substr(1, aspectsString.length - 2);
  const aspect_filter = `categoryId:{${category}},conditionDistributions:{${condition}},${newAspectsString}`;

  const liveUrl = 'https://api.ebay.com/buy/browse/v1/item_summary/search';

  const allParams = {
    filter: `buyingOptions:{${buyingOption}}`,
    sort,
    q: item,
    category_ids: category,
    aspect_filter,
  };

  const uri = axios.getUri({ url: liveUrl, params: allParams });

  return axios.get(uri, {
    headers,
  }).then((response) => {
    return response;
  }).catch((error) => {
    return error;
  });
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const { sessionSecret } = config || { sessionSecret: process.env.SESSION_SECRET };
  const session = await useSession(event, { password: sessionSecret });
  const query = getQuery(event);
  const { access_token } = session?.data.tokenData || {};
  const liveResults = await ebayLiveResults(query, access_token, 'AUCTION', 'endingSoonest');
  const binResults = await ebayLiveResults(query, access_token, 'FIXED_PRICE', 'price');
  return { data: { auction: liveResults.data, bin: binResults.data } };
});
