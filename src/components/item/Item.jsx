import React from 'react';
import { KitButton } from '@my2rela/react-kit';

import './Item.scss';

const Item = (props) => {
  const {
    item: i,
    onDecrement,
    onIncrement,
    onRemove,
  } = props;

  return (
    <div key={i.barcode} className="item-comp__list-item">
      <span className="item-comp__list-item__name">{i.name} - {i.barcode}</span>
      <span className="item-comp__list-item__price">{i.price} Ar</span>
      <span className="item-comp__list-item__price">Total: {i.price * i.quantity} Ar</span>
      <span className="item-comp__list-item__quantity">Command Qtt: {i.quantity}</span>
      <div className="item-comp__list-item__action">
        <KitButton className="item__action-button minus" onClick={() => onDecrement(i.barcode)}>-1</KitButton>
        <KitButton className="item__action-button plus" onClick={() => onIncrement(i)}>+1</KitButton>
        <KitButton className="item__action-button remove" onClick={() => onRemove(i.barcode)}>x</KitButton>
      </div>
    </div>
  );
};

export default Item;
