import React from 'react';

import './Cart.scss';

import Item from '../item/Item';

const Cart = (props) => {
  const {
    items,
    onIncrement,
    onDecrement,
    onRemove,
  } = props;

  const renderItems = () => items.map((i) => (
    <Item
      key={i.barcode}
      item={i}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onRemove={onRemove}
    />
  ));

  return (
    <div className="cart-comp">
      <div className="cart-comp__list">
        {renderItems()}
      </div>
    </div>
  );
};

export default Cart;
