import { bodyApiCall } from './api';

export const createSale = async (sale) => {
  const res = await bodyApiCall('POST', '/private/sales', sale);

  return res;
};

export const cancelLastSale = async () => {
  const res = await bodyApiCall('PATCH', '/admin/sales');

  return res;
};
