import React, { useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

import './Menu.scss';

import Config from '../../config/config';
import { UserContext } from '../../context/users/UserContext';
import { removeToken, getToken } from '../../helpers/storage';
import { checkUser } from '../../api/user.api';

const linkList = [
  {
    path: '/inventories',
    name: 'Inventories',
  },
  {
    path: '/cashier',
    name: 'Cashier',
  },
  {
    path: '/sales',
    name: 'Sales',
  },
  {
    path: '/users',
    name: 'Users',
  },
];

const Menu = () => {
  const [userInfos, setUserInfos] = useContext(UserContext);

  useEffect(() => {
    const callApi = async () => {
      const response = await checkUser(getToken());

      if (response && response.user) {
        setUserInfos({ ...userInfos, user: response.user });
      }
    };

    callApi();
  }, []);

  const renderNavLink = () => linkList.map((l) => (
    <div className="menu__item__navlink-item" key={l.name}>
      <NavLink to={l.path} activeClassName="menu__item__navlink-item__active">{l.name}</NavLink>
    </div>
  ));

  const renderClientName = () => {
    if (!userInfos || !userInfos.user) {
      return '';
    }

    return Config.client.name;
  };

  const handleLogOut = () => {
    setUserInfos({ user: null });
    removeToken();
  };

  const renderMenu = () => {
    if (!userInfos || !userInfos.user) {
      return <div />;
    }

    return (
      <>
        <div className="menu__item">
          <span className="menu__item__title">{renderClientName()}</span>
        </div>
        <div className="menu__item">
          <div className="menu__item__navlink">{renderNavLink()}</div>
        </div>
        <div className="menu__item">
          <div className="menu__item__link-logout">
            <Link to="/" onClick={handleLogOut}>log out</Link>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="menu">
      {renderMenu()}
    </div>
  );
};

export default Menu;
