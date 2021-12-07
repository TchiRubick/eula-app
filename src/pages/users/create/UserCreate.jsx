import React, { useState } from 'react';
import {
  KitContainer,
  KitTextField,
  KitButton,
  KitAlert,
} from '@my2rela/react-kit';

import { useHistory } from 'react-router-dom';

import './UserCreate.scss';

import { createUser } from '../../../api/user.api';

const UserCreate = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const history = useHistory();

  const handleChange = (key) => ({ target }) => {
    setFormData({ ...formData, [key]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (processing) {
      return;
    }

    setProcessing(true);

    const user = await createUser({ ...formData, role: 'user' });

    if (user instanceof Error) {
      setAlertMessage(user.message);
      setIsAlertOpen(true);
      return;
    }

    history.push('/users');
  };

  const handleNotificationClose = () => {
    setIsAlertOpen(false);
  };

  return (
    <div className="user-create">
      <KitAlert type="error" isOpen={isAlertOpen} onClose={handleNotificationClose}>
        {alertMessage}
      </KitAlert>
      <h1>Add a new user</h1>
      <KitContainer>
        <form onSubmit={handleSubmit}>
          <KitTextField className="user-create__input" label="Name" onChange={handleChange('name')} />
          <KitTextField className="user-create__input" label="Email" onChange={handleChange('email')} />
          <KitTextField className="user-create__input" label="Password" type="password" onChange={handleChange('password')} />
          <KitButton className="user-create__button" type="submit" onClick={handleSubmit}>Submit</KitButton>
        </form>
      </KitContainer>
    </div>
  );
};

export default UserCreate;
