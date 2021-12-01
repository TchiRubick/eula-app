import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { KitContainer } from '@my2rela/react-kit';

import './Layout.scss';

import Menu from '../menu/Menu';
import UserProvider from '../../context/users/UserContext';

const Layout = (props) => {
  const { children } = props;

  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      unlisten();
    };
  }, []);

  return (
    <UserProvider>
      <div className="layout">
        <div className="layout__header">
          <Menu />
        </div>
        <KitContainer>
          <div className="layout__body">
            {children}
          </div>
        </KitContainer>
      </div>
    </UserProvider>
  );
};

export default Layout;
