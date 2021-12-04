import { bodyApiCall, queryApiCall } from './api';

export const createSale = async (sale) => {
  const res = await bodyApiCall('POST', '/private/sales', sale);

  return res;
};

export const cancelLastSale = async () => {
  const res = await bodyApiCall('PATCH', '/private/sales');

  return res;
};

export const getLastSale = async () => {
  const res = await queryApiCall('GET', '/private/sales/last-ticket');

  return res;
};
