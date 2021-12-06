import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.scss';

import { KitTheme } from '@my2rela/react-kit';

import Layout from './components/layout/Layout';

import Home from './pages/home/Home';
import InventoryCreate from './pages/inventories/create/InventoryCreate';
import InventoriesList from './pages/inventories/list/InventoriesList';
import InventoryDetails from './pages/inventories/details/InventoryDetails';
import UserList from './pages/users/list/UserList';
import UserCreate from './pages/users/create/UserCreate';
import Cashier from './pages/cashier/Cashier';
import NotFound from './pages/errors/notFound/NotFound';

const App = () => (
  <div className="App">
    <BrowserRouter>
      <KitTheme>
        <Layout>
          <Switch>
            <Route exact path="/"><Home /></Route>
            <Route exact path="/inventories"><InventoriesList /></Route>
            <Route exact path="/inventories/create"><InventoryCreate /></Route>
            <Route exact path="/inventories/inventorie/:barcode"><InventoryDetails /></Route>
            <Route exact path="/cashier"><Cashier /></Route>
            <Route exact path="/users"><UserList /></Route>
            <Route exact path="/users/create"><UserCreate /></Route>
            <Route><NotFound /></Route>
          </Switch>
        </Layout>
      </KitTheme>
    </BrowserRouter>
  </div>
);

export default App;
