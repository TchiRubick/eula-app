import React, { useState } from 'react';
import { KitContainer, KitAlert } from '@my2rela/react-kit';
import { useHistory } from 'react-router-dom';

import './InventoryCreate.scss';

import FormInventory from '../../../components/forms/inventory/FormInventory';
import { createInventory } from '../../../api/inventory.api';

const InventoryCreate = () => {
  const history = useHistory();
  const [processing, setProcessing] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [cleanFields, setCleanFields] = useState(false);

  const handleSubmit = async (value) => {
    setProcessing(true);

    const response = await createInventory(value);

    if (response instanceof Error) {
      setAlertMessage(response.message);
      setAlertType('error');
      setProcessing(false);
      setIsAlertOpen(true);
      return;
    }

    setAlertMessage('Inventory created');
    setAlertType('success');
    setCleanFields(true);
    setProcessing(false);
    setIsAlertOpen(true);
    history.push(`/inventories/inventorie/${value.barcode}`);
  };

  const handleNotificationClose = () => {
    setIsAlertOpen(false);
  };

  const handleFieldCleaned = () => {
    setCleanFields(false);
  };

  return (
    <KitContainer>
      <KitAlert type={alertType} isOpen={isAlertOpen} onClose={handleNotificationClose}>
        {alertMessage}
      </KitAlert>
      <h1>Create an inventory</h1>
      <FormInventory
        onSubmit={handleSubmit}
        disableSubmit={processing}
        clean={cleanFields}
        onClean={handleFieldCleaned}
      />
    </KitContainer>
  );
};

export default InventoryCreate;
