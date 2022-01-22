import React from 'react';

import { Link } from 'react-router-dom';

import {
  KitSpinner,
  KitPagination,
  KitTextField,
  KitButton,
} from '@my2rela/react-kit';

import { HiOutlineSearch } from 'react-icons/hi';

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

  const renderLabel = () => (
    <>
      <HiOutlineSearch />&nbsp;Search by Barcode or Name
    </>
  );

  const renderFilter = () => (
    <div className="filter__input">
      <KitTextField
        value={search}
        label={renderLabel()}
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
        <span className="list__item-value__number __number-cost">&nbsp;{priceFormat(il.cost)}</span>
      </span>
    );
  };

  const getClassNameQuantity = (il) => {
    if (!il.quantity || il.quantity < 1) {
      return 'empty';
    }

    if (il.quantity < 10) {
      return 'warning';
    }

    return 'correct';
  };

  const renderList = () => items.map((il) => (
    <div className="list__item" key={il._id}>
      <div className="list__item-value-infos">
        <span className="list__item-value-infos_name">{il.name}</span>
        &nbsp;-&nbsp;
        <span className="list__item-value-infos__barcode">{il.barcode}</span>
      </div>
      <hr />
      <div className="list__item-value">
        {renderCost(il)}
        <span>
          <span className="list__item-value__label">Price:</span>
          <span className="list__item-value__number __number-price">&nbsp;{priceFormat(il.price)}</span>
        </span>
        <span>
          <span className="list__item-value__label">Quantity:</span>
          <span className={`list__item-value__number __number-${getClassNameQuantity(il)}`}>
            &nbsp;{il.quantity}
          </span>
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
