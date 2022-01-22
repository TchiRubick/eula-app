import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { KitContainer, KitButton } from '@my2rela/react-kit';
import { BsPlusLg } from 'react-icons/bs';

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

  const history = useHistory();

  const fetchData = async (s, p) => {
    setIsLoading(true);

    const query = {
      ...(s ? { search: s } : {}),
      ...(p ? { page: p } : {}),
      size: 30,
    };

    const fetchedInventoriesList = await getInventories(query);

    setInventoriesList(fetchedInventoriesList.inventories);
    setPagination({ page: p, total: fetchedInventoriesList.stats.totalPage });
    setIsLoading(false);
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
    fetchData(searchValue, pageAimed);
  };

  const handleItemSelect = (barcode) => {
    addToCart(barcode);
  };

  const handleClickCreate = () => {
    history.push('/inventories/create');
  };

  return (
    <div className="inventories-list-page">
      <KitContainer>
        <div className="inventories-list-page__button-add">
          <KitButton onClick={handleClickCreate}>
            <BsPlusLg />&nbsp;Create Inventory
          </KitButton>
        </div>
        <InvList
          items={inventoriesList}
          pagination={pagination}
          loading={isLoading}
          search={searchValue}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          onSelectItem={handleItemSelect}
        />
      </KitContainer>
    </div>
  );
};

export default InventoriesList;
