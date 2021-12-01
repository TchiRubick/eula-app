import React, { useState, useEffect } from 'react';

import { KitTextField, KitContainer, KitButton } from '@my2rela/react-kit';
import useScanDetection from 'use-scan-detection';

import './Cashier.scss';

import { getInventories, getInventory } from '../../api/inventory.api';
import InventoriesList from '../../components/lists/inventories/InventoriesList';
import Cart from '../../components/cart/Cart';

let delayer;

const Cashier = () => {
  const [cart, setCart] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [search, setSearch] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [moneyBack, setMoneyBack] = useState(0);
  const [amountPay, setAmountPay] = useState(0);

  useEffect(() => {
    fetchInvs();
  }, []);

  useEffect(() => {
    if (!cart) {
      setTotalPrice(0);
      return;
    }

    const sum = cart.reduce((acc, cur) => {
      const sub = cur.price * cur.quantity;

      return parseFloat(acc) + parseFloat(sub);
    }, 0);

    setTotalPrice(sum);

    setMoneyBack((sum - amountPay) * -1);
  }, [JSON.stringify(cart), amountPay]);

  const fetchInvs = async (s) => {
    const invs = await getInventories({
      ...(s ? { search: s } : {}),
      size: 5,
    });

    if (invs instanceof Error) {
      return;
    }

    setInventories(invs.inventories);
  };

  const addToCart = (item) => {
    let index = -1;

    index = cart.findIndex((c) => c.barcode === item.barcode);

    if (index < 0) {
      const newEntry = {
        barcode: item.barcode,
        quantity: 1,
        price: item.price,
      };

      setCart([...cart, newEntry]);
      return;
    }

    const clonedCart = [...cart];

    clonedCart[index] = {
      barcode: item.barcode,
      quantity: clonedCart[index].quantity + 1,
      price: item.price,
    };

    setCart(clonedCart);
  };

  const minusToCart = (barcode) => {
    let index = -1;

    index = cart.findIndex((c) => c.barcode === barcode);

    if (index < 0) {
      return;
    }

    const clonedCart = [...cart];

    const newQuantity = clonedCart[index].quantity - 1;

    clonedCart[index] = { ...clonedCart[index], quantity: newQuantity < 1 ? 1 : newQuantity };

    setCart(clonedCart);
  };

  const removeToCart = (barcode) => {
    let index = -1;

    index = cart.findIndex((c) => c.barcode === barcode);

    if (index < 0) {
      return;
    }

    const clonedCart = [...cart];

    clonedCart.splice(index, 1);

    setCart(clonedCart);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);

    clearTimeout(delayer);

    delayer = setTimeout(async () => {
      fetchInvs(e.target.value);
    }, 500);
  };

  const handleBarcodeChange = async (v) => {
    const reg = /^\d+$/;

    if (!reg.test(v)) {
      return;
    }

    let index = -1;

    index = cart.findIndex((c) => c.barcode === v);

    if (index >= 0) {
      addToCart(cart[index]);
      return;
    }

    const inv = await getInventory(v);

    if (inv instanceof Error === false) {
      addToCart(inv.inventory);
    }
  };

  const handleScannedBarcode = (v) => {
    const reg = /^\d+$/;

    if (!reg.test(v)) {
      return;
    }

    setSearchBarcode(v);
    handleBarcodeChange(v);
  };

  const handleTypedBarcode = (e) => {
    setSearchBarcode(e.target.value);

    clearTimeout(delayer);

    if (e.target.value) {
      delayer = setTimeout(async () => {
        handleBarcodeChange(e.target.value);
      }, 1000);
    }
  };

  const handleAmoutToPay = (e) => {
    setAmountPay(e.target.value);
  };

  const handlePay = () => {

  };

  useScanDetection({ onComplete: handleScannedBarcode });

  return (
    <KitContainer>
      <div className="cashier">
        <div className="cashier__items">
          <InventoriesList
            items={inventories}
            search={search}
            onSearchChange={handleSearchChange}
            onSelectItem={addToCart}
          />
        </div>
        <div className="cashier__cart">
          <div className="cashier__cart-list">
            <KitTextField label="Barcode" value={searchBarcode} onChange={handleTypedBarcode} />
            <Cart
              items={cart}
              onIncrement={addToCart}
              onDecrement={minusToCart}
              onRemove={removeToCart}
            />
          </div>
          <div className="cashier__cart-pay">
            <span className="cashier__cart-pay-value">Total: {totalPrice}</span>
            <span className="cashier__cart-pay-change">Change: {moneyBack}</span>
            <KitTextField label="Payed" type="number" value={amountPay} onChange={handleAmoutToPay} />
            <div className="cashier__cart-pay__action">
              <KitButton className="cashier__cart-pay__action-pay" onClick={handlePay}>Pay</KitButton>
              <KitButton className="cashier__cart-pay__action-cancel" onClick={handlePay}>Cancel</KitButton>
            </div>
          </div>
        </div>
      </div>
    </KitContainer>
  );
};

export default Cashier;