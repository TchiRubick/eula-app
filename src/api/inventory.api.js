import { bodyApiCall, queryApiCall } from './api';

export const createInventory = async (inventory) => {
  const res = await bodyApiCall('POST', '/private/inventories', inventory);

  return res;
};

export const updateInventory = async (barcode, inventory) => {
  const res = await bodyApiCall('PUT', `/private/inventories/${barcode}`, inventory);

  return res;
};

export const getInventories = async (query) => {
  const res = await queryApiCall('GET', '/private/inventories', query);

  return res;
};

export const getInventory = async (barcode) => {
  const res = await queryApiCall('GET', `/private/inventories/${barcode}`);

  return res;
};
