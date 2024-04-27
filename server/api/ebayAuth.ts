/* eslint-disable camelcase */
import axios from 'axios';

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

export default getToken;
