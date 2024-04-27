/* eslint-disable camelcase */
import axios from 'axios';
// eslint-disable-next-line import/extensions
import getToken from './ebayAuth';

const ebayRefinements = (params, token) => {
  const {
    item,
    category,
  } = params;
  const headers = {
    Authorization: `Bearer ${token}`,
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
  const config = useRuntimeConfig(event);
  if (!event?.context?.session?.data?.access_token) {
    const tokenData = await getToken(config);
    event.context.session.data = { tokenData };
    const token = tokenData.access_token;
    const refinements = await ebayRefinements(query, token);
    return { data: refinements.data };
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
