import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import {
  KitContainer,
  KitTextField,
  KitButton,
  KitAlert,
} from '@my2rela/react-kit';

import './ChangePassword.scss';

import { changePassword } from '../../../api/user.api';
import { removeToken } from '../../../helpers/storage';
import { UserContext } from '../../../context/users/UserContext';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const [, setUserInfos] = useContext(UserContext);

  const history = useHistory();

  const handleNotificationClose = () => {
    setIsAlertOpen(false);
  };

  const handleChangeConfirm = ({ target }) => {
    setConfirmPassword(target.value);
  };

  const handleChangePassword = ({ target }) => {
    setPassword(target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (processing) {
      return;
    }

    setProcessing(true);

    const user = await changePassword({ password });

    if (user instanceof Error) {
      setAlertMessage(user.message);
      setIsAlertOpen(true);
      return;
    }

    setUserInfos({ user: null });
    removeToken();
    history.push('/');
  };

  const isValidForm = () => {
    if (confirmPassword < 5 || password < 5) {
      return false;
    }

    if (confirmPassword !== password) {
      return false;
    }

    return true;
  };

  return (
    <div className="change-password">
      <KitAlert type="error" isOpen={isAlertOpen} onClose={handleNotificationClose}>
        {alertMessage}
      </KitAlert>
      <h1>Change my password</h1>
      <KitContainer>
        <form onSubmit={handleSubmit}>
          <KitTextField className="change-password__input" label="Password" type="password" onChange={handleChangePassword} />
          <KitTextField className="change-password__input" label="Confirm Password" type="password" onChange={handleChangeConfirm} />
          <KitButton className="change-password__button" disabled={!isValidForm} type="submit" onClick={handleSubmit}>Submit</KitButton>
        </form>
      </KitContainer>
    </div>
  );
};

export default ChangePassword;
