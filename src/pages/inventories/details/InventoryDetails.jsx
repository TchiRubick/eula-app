import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { KitContainer, KitAlert, KitSpinner } from '@my2rela/react-kit';

import './InventoryDetails.scss';

import FormInventory from '../../../components/forms/inventory/FormInventory';
import { getInventory, updateInventory } from '../../../api/inventory.api';
import { priceFormat } from '../../../helpers/transform';

const InventoryDetails = () => {
  const { barcode } = useParams();
  const history = useHistory();

  const [processing, setProcessing] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [isLoading, setIsLoading] = useState(false);
  const [preValue, setPreValue] = useState({});
  const [responseValue, setResponseValue] = useState({});

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getInventory(barcode),
    ]).then(([inventoriesResponse]) => {
      setPreValue({
        barcode: inventoriesResponse.inventory.barcode,
        name: inventoriesResponse.inventory.name,
        cost: inventoriesResponse.inventory.cost,
        price: inventoriesResponse.inventory.price,
        quantity: 0,
      });
      setResponseValue(inventoriesResponse.inventory);
      setIsLoading(false);
    });
  }, [barcode]);

  const handleSubmit = async (values) => {
    setProcessing(true);

    let params = {};

    if (values.barcode !== responseValue.barcode) {
      params = { ...params, barcode: values.barcode };
    }

    if (values.name !== responseValue.name) {
      params = { ...params, name: values.name };
    }

    if (values.cost) {
      params = { ...params, cost: values.cost };
    }

    if (values.price) {
      params = { ...params, price: values.price };
    }

    if (values.quantity) {
      params = { ...params, quantity: values.quantity };
    }

    const response = await updateInventory(barcode, params);

    if (response instanceof Error) {
      setAlertMessage(response.message);
      setAlertType('error');
      setProcessing(false);
      setIsAlertOpen(true);
      return;
    }

    setAlertMessage('Inventory Updated');
    setAlertType('success');
    setProcessing(false);
    setIsAlertOpen(true);
    history.push(`/inventories/inventorie/${values.barcode}`);
  };

  const handleNotificationClose = () => {
    setIsAlertOpen(false);
  };

  const renderForm = () => (
    <div className="inventorie-details-page__form">
      <h1>Update inventorie: {responseValue.name} - {responseValue.barcode}</h1>
      <div className="inventorie-details-page__form-infos">
        <span>Cost: <b>{priceFormat(responseValue.cost)}</b></span>
        <span>Price: <b>{priceFormat(responseValue.price)}</b></span>
        <span>Stock: <b>{responseValue.quantity}</b></span>
      </div>
      <FormInventory preFilled={preValue} onSubmit={handleSubmit} disableSubmit={processing} />
    </div>
  );

  const renderLoader = () => (
    <div className="inventorie-details-page__loader">
      <KitSpinner show={isLoading} />
    </div>
  );

  return (
    <div className="inventorie-details-page">
      <KitContainer>
        <KitAlert isOpen={isAlertOpen} onClose={handleNotificationClose} type={alertType}>
          {alertMessage}
        </KitAlert>
        {isLoading ? renderLoader() : renderForm()}
      </KitContainer>
    </div>
  );
};

export default InventoryDetails;
