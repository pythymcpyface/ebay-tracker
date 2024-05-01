/* eslint-disable camelcase */
import axios from 'axios';
import { defineEventHandler, useSession } from 'h3';

const getToken = (config) => {
  const { clientId, clientSecret } = config;
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

  return axios.post(config.tokenUrl, body, { headers })
    .then((response) => {
      const mint_time = Math.floor(Date.now() / 1000);
      return { ...response.data, mint_time };
    }).catch((error) => {
      return error;
    });
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const session = await useSession(event, { password: config.sessionSecret });
  const now = Math.floor(Date.now() / 1000);
  let { access_token, expires_in, mint_time } = session?.data.tokenData || {};
  if (!access_token || ((now - mint_time) > (expires_in - 30))) {
    const tokenData = await getToken(config);
    access_token = tokenData.access_token;
    await session.update({ tokenData });
  }
  return { token: {
    access_token,
  } };
});
