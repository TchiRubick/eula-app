import React, { useState, useContext } from 'react';

import {
  KitTextField,
  KitContainer,
  KitButton,
  KitAlert,
} from '@my2rela/react-kit';

import './Home.scss';

import { authentication } from '../../api/user.api';
import { setToken } from '../../helpers/storage';
import { UserContext } from '../../context/users/UserContext';

const Home = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRequestLocked, setIsRequestLocked] = useState(false);

  const [userInfos, setUserInfos] = useContext(UserContext);

  const handleChange = (key) => (e) => {
    setValues({ ...values, [key]: e.target.value });
  };

  const isValid = (v) => v.length > 2;

  const handleButtonClick = async () => {
    setIsRequestLocked(true);

    const response = await authentication(values);

    if (response instanceof Error) {
      setErrorMessage(response.message);
      setIsAlertOpen(true);
      setIsRequestLocked(false);
      return;
    }

    setToken(response.token);
    setUserInfos({ ...userInfos, user: response.user });
  };

  const handleNotificationClose = () => {
    setIsAlertOpen(false);
  };

  const handleButtonState = () => {
    if (isRequestLocked) {
      return true;
    }

    return (!isValid(values.email) || !isValid(values.password));
  };

  const pageContent = () => {
    if (userInfos.user) {
      return (
        <div>Dashboard, under development</div>
      );
    }

    return (
      <div className="page-home__container__card">
        <div className="page-home__container-grid">
          <div className="page-home__container-grid__item">
            <KitTextField
              placeholder="rakoto@mail.mg"
              label="Email"
              onChange={handleChange('email')}
              value={values.email}
            />
          </div>
          <div className="page-home__container-grid__item">
            <KitTextField
              placeholder="*********"
              label="Password"
              type="password"
              onChange={handleChange('password')}
              value={values.password}
            />
          </div>
        </div>
        <div className="page-home__container-grid">
          <KitButton disabled={handleButtonState()} onClick={handleButtonClick}>
            Log in
          </KitButton>
        </div>
      </div>
    );
  };

  return (
    <div className="page-home">
      <KitAlert type="error" isOpen={isAlertOpen} onClose={handleNotificationClose}>
        {errorMessage}
      </KitAlert>
      <KitContainer className="page-home__container">
        {pageContent()}
      </KitContainer>
    </div>
  );
};

export default Home;