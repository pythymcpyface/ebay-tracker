/* eslint-disable camelcase */
import axios from 'axios';
// eslint-disable-next-line import/extensions
import { defineEventHandler, useSession } from 'h3';

const ebayRefinements = (params, token) => {
  Object.keys(params).forEach((key) => {
    if (!params[key]) {
      delete params[key];
    }
  });
  const {
    item,
    category,
    marketplace,
  } = params;
  const headers = {
    Authorization: `Bearer ${token}`,
    'X-EBAY-C-MARKETPLACE-ID': marketplace,
  };
  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${item}&fieldgroups=ASPECT_REFINEMENTS,CATEGORY_REFINEMENTS,CONDITION_REFINEMENTS,BUYING_OPTION_REFINEMENTS&category_ids=${category}`;
  return axios.get(url, {
    headers,
  }).then((response) => {
    return response;
  }).catch((error) => {
    return error;
  });
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const session = await useSession(event, { password: process.env.NUXT_SESSION_SECRET || '' });
  const { access_token } = session.data.tokenData || {};
  const refinements = await ebayRefinements(query, access_token);
  return { data: refinements.data };
});
