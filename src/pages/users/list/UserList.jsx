import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { KitButton, KitContainer } from '@my2rela/react-kit';

import './UserList.scss';

import { getUserList } from '../../../api/user.api';

const UserList = () => {
  const [items, setItems] = useState([]);
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

  const handleClickCreate = () => {
    history.push('/users/create');
  };

  const renderItems = () => items.map((i) => {
    const { _id: userId } = i;

    return (
      <div className="user-list__user-info" key={userId}>
        <div className="user-info__content content__name">{i.name}</div>
        <div className="user-info__content content__email">{i.email}</div>
        <div className="user-info__content content__role">{i.role}</div>
        <div className="user-info__content content__action">
          <KitButton>Remove</KitButton>
        </div>
      </div>
    );
  });

  const renderHeader = () => (
    <div className="user-list__user-info-header">
      <div className="user-info__header-list header__name"><span>Name</span></div>
      <div className="user-info__header-list header__email"><span>Email</span></div>
      <div className="user-info__header-list header__role"><span>Role</span></div>
      <div className="user-info__header-list header__action"><span>Action</span></div>
    </div>
  );

  return (
    <div className="user-list">
      <KitContainer>
        <KitButton className="user-list__create-user" onClick={handleClickCreate}>Create User</KitButton>
        {renderHeader()}
        {renderItems()}
      </KitContainer>
    </div>
  );
};

export default UserList;
