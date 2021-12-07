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

export const createUser = async (body) => {
  const res = await bodyApiCall('POST', '/admin/users/', body);

  return res;
};

export const changePassword = async (body) => {
  const res = await bodyApiCall('PUT', '/private/users/new-password', body);

  return res;
};
