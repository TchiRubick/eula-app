import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { KitButton, KitContainer } from '@my2rela/react-kit';

import './UserList.scss';

import { getUserList } from '../../../api/user.api';
import { UserContext } from '../../../context/users/UserContext';

const UserList = () => {
  const [items, setItems] = useState([]);
  const [userInfos] = useContext(UserContext);

  const { user } = userInfos;
  const history = useHistory();

  useEffect(() => {
    const callApi = async () => {
      const ls = await getUserList();

      if (ls instanceof Error) {
        return;
      }

      setItems(ls.users);
    };

    callApi();
  }, []);

  const renderButton = (i) => {
    if (i.role === 'removed') {
      return <KitButton disabled>Reactivate</KitButton>;
    }

    if (i.email === user.email || i.email === 'super-admin') {
      return null;
    }

    return <KitButton disabled={user.role !== 'admin'}>Remove</KitButton>;
  };

  const renderItems = () => items.map((i) => {
    const { _id: userId } = i;

    return (
      <div className="user-list__user-info" key={userId}>
        <div className="user-info__content content__name">{i.name}</div>
        <div className="user-info__content content__email">{i.email}</div>
        <div className="user-info__content content__role">{i.role}</div>
        <div className="user-info__content content__action">
          {renderButton(i)}
        </div>
      </div>
    );
  });

  const renderHeader = () => (
    <div className="user-list__user-info-header">
      <div className="user-info__header-list header__name"><span>Name</span></div>
      <div className="user-info__header-list header__email"><span>Email</span></div>
      <div className="user-info__header-list header__role"><span>Status</span></div>
      <div className="user-info__header-list header__action"><span>Action</span></div>
    </div>
  );

  return (
    <div className="user-list">
      <KitContainer>
        <div className="user-list__actions">
          <div className="actions__create-user">
            <KitButton onClick={() => history.push('/users/create')}>Create User</KitButton>
          </div>
          <div className="actions__change-password">
            <KitButton onClick={() => history.push('/users/new-password')}>Update password</KitButton>
          </div>
        </div>
        {renderHeader()}
        {renderItems()}
      </KitContainer>
    </div>
  );
};

export default UserList;
