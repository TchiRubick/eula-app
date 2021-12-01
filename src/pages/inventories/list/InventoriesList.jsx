import React, { useState, useEffect } from 'react';

import { KitContainer } from '@my2rela/react-kit';

import './InventoriesList.scss';

import { addToCart } from '../../../helpers/storage';
import { getInventories } from '../../../api/inventory.api';
// eslint-disable-next-line import/no-named-default
import { default as InvList } from '../../../components/lists/inventories/InventoriesList';

let delayer = null;

const defaultPagination = {
  total: 0,
  page: 1,
};

const InventoriesList = () => {
  const [inventoriesList, setInventoriesList] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = (s, p) => {
    setIsLoading(true);

    const query = {
      ...(s ? { search: s } : {}),
      ...(p ? { page: p } : {}),
      size: 30,
    };

    Promise.all([
      getInventories(query),
    ]).then(([fetchedInventoriesList]) => {
      setInventoriesList(fetchedInventoriesList.inventories);
      setPagination({ ...pagination, total: fetchedInventoriesList.stats.totalPage });
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchData(searchValue, pagination.page);
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);

    clearTimeout(delayer);
    delayer = setTimeout(() => {
      setPagination(defaultPagination);
      fetchData(e.target.value, 1);
    }, 500);
  };

  const handlePageChange = (_e, pageAimed) => {
    setPagination({ ...pagination, page: pageAimed });
    fetchData(searchValue, pageAimed);
  };

  const handleItemSelect = (barcode) => {
    addToCart(barcode);
  };

  return (
    <KitContainer>
      <div className="inventories-list-page">
        <InvList
          items={inventoriesList}
          pagination={pagination}
          loading={isLoading}
          search={searchValue}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          onSelectItem={handleItemSelect}
        />
      </div>
    </KitContainer>
  );
};

export default InventoriesList;