import React, { useState, useEffect } from 'react';
import { KitTextField, KitButton } from '@my2rela/react-kit';
import useScanDetection from 'use-scan-detection';

import './FormInventory.scss';

const defaultValues = {
  barcode: '',
  name: '',
  cost: 0,
  price: 0,
  quantity: 0,
};

const FormInventory = (props) => {
  const {
    onSubmit,
    preFilled,
    disableSubmit,
    clean,
    onClean,
  } = props;
  const [values, setValues] = useState({ ...defaultValues });

  useEffect(() => {
    if (clean) {
      setValues({ ...defaultValues });
      onClean();
    }
  }, [clean]);

  useEffect(() => {
    if (preFilled) {
      setValues({ ...values, ...preFilled });
    }
  }, [JSON.stringify(preFilled)]);

  const handleSubmitClick = () => {
    onSubmit({ ...values });
  };

  const handleChange = (key) => (e) => {
    setValues({ ...values, [key]: e.target.value });
  };

  const isValidBarcode = () => values.barcode && values.barcode.length > 9;

  const isValidName = () => values.name && values.name.length > 3;

  const isValidNumber = (key) => values[key] > -1;

  const isCostValid = () => {
    if (values.quantity > 0) {
      return values.cost > 0;
    }

    return true;
  };

  const isValidForm = () => isValidBarcode()
    && isValidName()
    && isValidNumber('cost')
    && isValidNumber('price')
    && isValidNumber('quantity')
    && isCostValid()
    && !disableSubmit;

  const setBarcodeScan = (barcode) => {
    setValues({ ...values, barcode });
  };

  useScanDetection({ onComplete: setBarcodeScan });

  return (
    <div className="form-inventorie">
      <div className="form-inventorie__item">
        <KitTextField
          label="barcode"
          onChange={handleChange('barcode')}
          value={values.barcode}
          error={values.barcode && !isValidBarcode() ? 'The barcode is not valid' : ''}
        />
      </div>
      <div className="form-inventorie__item">
        <KitTextField
          label="name"
          onChange={handleChange('name')}
          value={values.name}
          error={values.name && !isValidName() ? 'The name is not valid' : ''}
        />
      </div>
      <div className="form-inventorie__item-quantify">
        <div className="form-inventorie__item">
          <KitTextField
            type="number"
            label="cost"
            onChange={handleChange('cost')}
            value={values.cost}
            error={values.cost && (!isValidNumber('cost') || !isCostValid()) ? 'The cost can not be inferior to 0 and must be defined if there\'s a quantity' : ''}
          />
        </div>
        <div className="form-inventorie__item">
          <KitTextField
            type="number"
            label="price"
            onChange={handleChange('price')}
            value={values.price}
            error={values.price && !isValidNumber('price') ? 'The price can not be inferior to 0' : ''}
          />
        </div>
        <div className="form-inventorie__item">
          <KitTextField
            type="number"
            label="quantity"
            onChange={handleChange('quantity')}
            value={values.quantity}
            error={values.quantity && !isValidNumber('quantity') ? 'The quantity can not be inferior to 0' : ''}
          />
        </div>
      </div>
      <div className="form-inventorie__item-action">
        <KitButton disabled={!isValidForm()} onClick={handleSubmitClick}>Submit</KitButton>
      </div>
    </div>
  );
};

export default FormInventory;
