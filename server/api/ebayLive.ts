/* eslint-disable camelcase */
import axios from 'axios';
// eslint-disable-next-line import/extensions
import getToken from './ebayAuth';
import utils from '../../utils';

const ebayLiveResults = (params, token) => {
  Object.keys(params).forEach((key) => {
    if (!params[key]) {
      delete params[key];
    }
  });
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const {
    item,
    category,
    condition,
  } = params;

  const aspects = { ...params };
  delete aspects.item;
  delete aspects.category;
  delete aspects.buyingOption;
  delete aspects.condition;

  const aspectsEncoded = utils.encodeObject(aspects);
  const newAspectsEncoded = { ...aspectsEncoded };
  Object.keys(aspectsEncoded).forEach((key) => {
    newAspectsEncoded[key] = `{${aspectsEncoded[key]}}`;
  });

  const aspectsString = JSON.stringify(newAspectsEncoded).replace(/"/g, '');
  const newAspectsString = aspectsString.substr(1, aspectsString.length - 2);

  const liveUrl = 'https://api.ebay.com/buy/browse/v1/item_summary/search';

  const otherParams = {
    filter: 'buyingOptions:{AUCTION}',
    sort: 'endingSoonest',
    q: item,
    category_ids: category,
  };

  const otherParamsEncoded = utils.encodeObject(otherParams);

  const paramsEncoded = {
    ...otherParamsEncoded,
    aspect_filter: `categoryId:${category},conditionDistributions:{${condition}},${newAspectsString}`,
  };

  const uri = axios.getUri({ url: liveUrl, params: paramsEncoded });

  return axios.get(uri, {
    headers,
  }).then((response) => {
    return response;
  }).catch((error) => {
    return error;
  });
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig(event);
  if (!event?.context?.session?.data?.access_token) {
    const tokenData = await getToken(config);
    event.context.session.data = { tokenData };
    const token = tokenData.access_token;
    const results = await ebayLiveResults(query, token);
    return { data: results.data };
  }
  if (event?.context?.session?.data?.access_token) {
    const now = Math.floor(Date.now() / 1000);
    const { expires_in, mint_time } = event.context.session.data;
    const expired = ((now - mint_time) > (expires_in - 30));
    if (expired) {
      const tokenData = await getToken(config);
      event.context.session.data = { tokenData };
      return { data: tokenData.access_token };
    }
    return { data: event.context.session.data.access_token };
  }
});
