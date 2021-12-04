import React, { useState, useEffect } from 'react';

import {
  KitTextField,
  KitContainer,
  KitButton,
  KitAlert,
} from '@my2rela/react-kit';
import useScanDetection from 'use-scan-detection';

import './Cashier.scss';

import { getInventories, getInventory } from '../../api/inventory.api';
import { createSale, getLastSale, cancelLastSale } from '../../api/sale.api';
import InventoriesList from '../../components/lists/inventories/InventoriesList';
import Cart from '../../components/cart/Cart';
import SaleItem from '../../components/saleItem/SaleItem';

let delayer;

const Cashier = () => {
  const [cart, setCart] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [search, setSearch] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [moneyBack, setMoneyBack] = useState(0);
  const [amountPay, setAmountPay] = useState(0);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [lastSale, setLastSale] = useState(null);

  useEffect(() => {
    fetchInvs();
    fetchLastSale();
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

    if (!amountPay || amountPay < 1 || totalPrice < 1) {
      setMoneyBack(0);
      return;
    }

    setMoneyBack((sum - amountPay) * -1);
  }, [JSON.stringify(cart), amountPay]);

  const fetchLastSale = async () => {
    const last = await getLastSale();

    if (last instanceof Error) {
      return;
    }

    setLastSale(last.sale);
  };

  const fetchInvs = async (s) => {
    const invs = await getInventories({
      ...(s ? { search: s } : {}),
      size: 6,
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
        name: item.name,
        quantity: 1,
        price: item.price,
      };

      setCart([...cart, newEntry]);
      return;
    }

    const clonedCart = [...cart];

    clonedCart[index] = {
      barcode: item.barcode,
      name: item.name,
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

  const handleCancel = () => {
    setCart([]);
    setSearch('');
    setSearchBarcode('');
    setAmountPay(0);
    setTotalPrice(0);
    setMoneyBack(0);
  };

  const handlePay = async () => {
    const saleData = {
      inventories: getInventoriesForSale(),
      payed: amountPay,
      backed: moneyBack,
    };

    const response = await createSale(saleData);

    if (response instanceof Error) {
      setAlertMessage(response.message);
      setAlertType('error');
      setIsAlertOpen(true);
      return;
    }

    setAlertMessage('Successful transaction');
    setAlertType('success');
    setIsAlertOpen(true);
    handleCancel();
    fetchLastSale();
  };

  const getInventoriesForSale = () => cart.map((c) => ({
    barcode: c.barcode,
    price: c.price,
    quantity: c.quantity,
  }));

  const isValidCart = () => cart.length > 0 && moneyBack >= 0;

  const handleNotificationClose = () => {
    setIsAlertOpen(false);
  };

  const handlePayFocus = () => {
    if (amountPay === 0) {
      setAmountPay('');
    }
  };

  const handlePayBlur = () => {
    if (amountPay === '') {
      setAmountPay(0);
    }
  };

  const cancelLastTransaction = async () => {
    const canceled = await cancelLastSale();

    if (canceled instanceof Error) {
      return;
    }

    setLastSale(canceled.sale);
  };

  useScanDetection({ onComplete: handleScannedBarcode });

  return (
    <KitContainer>
      <KitAlert type={alertType} isOpen={isAlertOpen} onClose={handleNotificationClose}>
        {alertMessage}
      </KitAlert>
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
            <KitTextField label="Scan" value={searchBarcode} onChange={handleTypedBarcode} />
            <Cart
              items={cart}
              onIncrement={addToCart}
              onDecrement={minusToCart}
              onRemove={removeToCart}
            />
          </div>
          <div className="cashier__cart-pay">
            <div className="cashier__cart-pay__resume">
              <span className="cashier__cart-pay-value">Total: {totalPrice}</span>
              <span className="cashier__cart-pay-change">Change: {moneyBack}</span>
            </div>
            <KitTextField label="Payed" type="number" onBlur={handlePayBlur} onFocus={handlePayFocus} value={amountPay} onChange={handleAmoutToPay} />
            <div className="cashier__cart-pay__action">
              <div className="cashier__cart-pay__action-pay">
                <KitButton className="action-pay__button" onClick={handlePay} disabled={!isValidCart()}>Pay</KitButton>
              </div>
              <div className="cashier__cart-pay__action-cancel">
                <KitButton className="action-cancel__button" onClick={handleCancel}>Clear</KitButton>
              </div>
            </div>
          </div>
          <div className="cashier__cart-last-transaction">
            <h5>Your last transaction</h5>
            <SaleItem item={lastSale} />
            <KitButton disabled={lastSale.status !== 'saled'} onClick={cancelLastTransaction}>Cancel this transaction</KitButton>
          </div>
        </div>
      </div>
    </KitContainer>
  );
};

export default Cashier;
