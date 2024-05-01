/* eslint-disable camelcase */
import axios from 'axios';
import { defineEventHandler, useSession } from 'h3';

const getToken = () => {
  const clientId = process.env.NUXT_EBAY_CLIENT_ID;
  const clientSecret = process.env.NUXT_EBAY_CLIENT_SECRET;
  const credsString = `${clientId}:${clientSecret}`;
  const encodedCreds = btoa(credsString);

  const body = {
    grant_type: 'client_credentials',
    scope: 'https://api.ebay.com/oauth/api_scope',
  };
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${encodedCreds}`,
  };

  return axios.post(process.env.NUXT_EBAY_TOKEN_URL || '', body, { headers })
    .then((response) => {
      const mint_time = Math.floor(Date.now() / 1000);
      return { ...response.data, mint_time };
    }).catch((error) => {
      return error;
    });
};

export default defineEventHandler(async (event) => {
  const session = await useSession(event, { password: process.env.NUXT_SESSION_SECRET || '' });
  const now = Math.floor(Date.now() / 1000);
  let { access_token, expires_in, mint_time } = session?.data.tokenData || {};
  if (!access_token || ((now - mint_time) > (expires_in - 30))) {
    const tokenData = await getToken();
    access_token = tokenData.access_token;
    await session.update({ tokenData });
  }
  return { token: {
    access_token,
  } };
});
