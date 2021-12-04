import React from 'react';

import './SaleItem.scss';

import { priceFormat } from '../../helpers/transform';

const SaleItem = (props) => {
  const { item } = props;

  if (!item) {
    return <div className="sale-item__none">No valid last sale</div>;
  }

  return (
    <div className="sale-item">
      <span className="sale-item__ticket">Ticket: <b>{item.ticket}</b></span>
      <span className="sale-item__ticket">Payed: <b>{priceFormat(item.payed)}</b></span>
      <span className="sale-item__ticket">Backed: <b>{priceFormat(item.backed)}</b></span>
      <span className="sale-item__ticket">Total: <b>{priceFormat(item.payed - item.backed)}</b></span>
      <span className="sale-item__ticket">Status: <b>{item.status}</b></span>
    </div>
  );
};

export default SaleItem;
