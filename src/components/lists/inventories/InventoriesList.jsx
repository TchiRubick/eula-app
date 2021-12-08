import React from 'react';

import { Link } from 'react-router-dom';

import {
  KitSpinner,
  KitPagination,
  KitTextField,
  KitButton,
} from '@my2rela/react-kit';

import './InventoriesList.scss';

import { priceFormat } from '../../../helpers/transform';

const InventoriesList = (props) => {
  const {
    items,
    loading,
    pagination,
    search,
    onPageChange,
    onSearchChange,
    onSelectItem,
    enableCart,
  } = props;

  const renderLoader = () => (
    <div className="list__loader">
      <KitSpinner show={loading} />
    </div>
  );

  const renderPagination = () => {
    if (!pagination) {
      return null;
    }

    return (
      <div className="pagination__navigation">
        <KitPagination total={pagination.total} actual={pagination.page} onChange={onPageChange} />
      </div>
    );
  };

  const renderFilter = () => (
    <div className="filter__input">
      <KitTextField
        value={search}
        label="Search by Barcode or Name"
        onChange={onSearchChange}
        placeholder="00000000000"
      />
    </div>
  );

  const renderButtonAdd = (il) => {
    if (!enableCart) {
      return null;
    }

    return (
      <KitButton
        className="list__item-button"
        onClick={() => onSelectItem({ barcode: il.barcode, price: il.price, name: il.name })}
        disabled={il.quantity < 1}
      >
        Add to cart
      </KitButton>
    );
  };

  const renderCost = (il) => {
    if (enableCart) {
      return null;
    }

    return (
      <span>
        <span className="list__item-value__label">Cost:</span>
        &nbsp;
        {priceFormat(il.cost)}
      </span>
    );
  };

  const renderList = () => items.map((il) => (
    <div className="list__item" key={il._id}>
      <div className="list__item-value">
        <span className="list__item-value__barcode">{il.barcode}</span>
        <span className="list__item-value_name">{il.name}</span>
      </div>
      <div className="list__item-value">
        {renderCost(il)}
        <span>
          <span className="list__item-value__label">Price:</span>
          &nbsp;
          {priceFormat(il.price)}
        </span>
      </div>
      <div className="list__item-value">
        <span>
          <span className="list__item-value__label">Quantity:</span>
          &nbsp;
          {il.quantity}
        </span>
      </div>
      <div className="list__item-value footer">
        {renderButtonAdd(il)}
        <Link to={`/inventories/inventory/${il.barcode}`}>
          <KitButton className="list__item-button details">Details</KitButton>
        </Link>
      </div>
    </div>
  ));

  return (
    <div className="inventories-list">
      <div className="inventories-list__filter">
        {renderFilter()}
      </div>
      <div className="inventories-list__list">
        {loading ? renderLoader() : renderList()}
        <div className="list__item-blur" />
      </div>
      <div className="inventories-list__pagination">
        {loading ? null : renderPagination()}
      </div>
    </div>
  );
};

export default InventoriesList;
