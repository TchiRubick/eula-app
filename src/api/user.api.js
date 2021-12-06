import { bodyApiCall, queryApiCall } from './api';

export const authentication = async (credentials) => {
  const res = await bodyApiCall('POST', '/public/users/', credentials);

  return res;
};

export const checkUser = async () => {
  const res = await queryApiCall('GET', '/private/users/');

  return res;
};

export const getUserList = async () => {
  const res = await queryApiCall('GET', '/admin/users/');

  return res;
};
