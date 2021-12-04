import React from 'react';
import { KitButton } from '@my2rela/react-kit';

import './Item.scss';

import { priceFormat } from '../../helpers/transform';

const Item = (props) => {
  const {
    item: i,
    onDecrement,
    onIncrement,
    onRemove,
  } = props;

  return (
    <div key={i.barcode} className="item-comp__list-item">
      <div className="item-comp__list-item__important-info">
        <span className="item-comp__list-item__name">{i.name} - {i.barcode}</span>
        <span className="item-comp__list-item__price">{priceFormat(i.price)}</span>
      </div>
      <div className="item-comp__list-item__important-commande">
        <span className="item-comp__list-item__quantity">Quantity: {i.quantity}</span>
        <span className="item-comp__list-item__price">Total: {priceFormat(i.price * i.quantity)}</span>
      </div>
      <div className="item-comp__list-item__action">
        <KitButton className="item__action-button minus" onClick={() => onDecrement(i.barcode)}>-1</KitButton>
        <KitButton className="item__action-button plus" onClick={() => onIncrement(i)}>+1</KitButton>
        <KitButton className="item__action-button remove" onClick={() => onRemove(i.barcode)}>x</KitButton>
      </div>
    </div>
  );
};

export default Item;
