import Config from '../config/config';

import { getToken } from '../helpers/storage';

const baseUrl = Config.baseApiUrl;

export const bodyApiCall = (method, path, body) => {
  const url = `${baseUrl}${path}`;
  const content = { method: method.toUpperCase(), body: JSON.stringify(body) };

  return handleFetch(url, content);
};

export const queryApiCall = (method, path, queries) => {
  let queryString = '';

  if (queries) {
    queryString = `?${Object.keys(queries).map((key) => `${key}=${queries[key]}`).join('&')}`;
  }

  const url = `${baseUrl}${path}${queryString}`;
  const content = { method: method.toUpperCase() };

  return handleFetch(url, content);
};

const handleFetch = async (url, content = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    mode: '*cors',
    Authorization: `Bearer ${getToken()}`,
  };

  const response = await fetch(url, {
    ...content,
    headers,
  });

  return handleResponse(response);
};

const handleResponse = (res) => res.json().then((json) => {
  if ((res.status >= 200 && res.status < 400)) {
    return json;
  }

  const error = new Error(json);
  error.status = res.status;
  error.message = json.error || json.message || res.statusText || 'UNKNOWN';

  throw error;
}).catch((err) => {
  if (err.status === 498) {
    return window.location.replace('/');
  }

  return err;
});
