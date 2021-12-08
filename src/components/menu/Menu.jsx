import React, { useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { FaCashRegister, FaRegListAlt } from 'react-icons/fa';
import { TiChartLineOutline, TiUser } from 'react-icons/ti';

import './Menu.scss';

import Config from '../../config/config';
import { UserContext } from '../../context/users/UserContext';
import { removeToken, getToken } from '../../helpers/storage';
import { checkUser } from '../../api/user.api';

const linkList = [
  {
    path: '/inventories',
    name: 'Inventories',
    icon: <FaRegListAlt size={15} />,
  },
  {
    path: '/cashier',
    name: 'Cashier',
    icon: <FaCashRegister size={15} />,
  },
  {
    path: '/sales',
    name: 'Sales',
    icon: <TiChartLineOutline size={15} />,
  },
  {
    path: '/users',
    name: 'Users',
    icon: <TiUser size={15} />,
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
      <NavLink to={l.path} activeClassName="menu__item__navlink-item__active">{l.icon} {l.name}</NavLink>
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
          <Link to="/" onClick={handleLogOut}>
            <div className="menu__item__link-logout">
              log out
            </div>
          </Link>
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
