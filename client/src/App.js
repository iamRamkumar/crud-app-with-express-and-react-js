import React from 'react';
import Cookies from 'js-cookie';
import { Switch, Route, Redirect } from 'react-router';
import Layout from './components/Layout';
import UserList from './components/UserList';
import Login from './components/Login';
import NotFound from './components/NotFound';

import './App.css';

const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        return loggedIn ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to="/"
          />
        );
      }}
    />
  );
};


function App() {
  const isLoggedin = Cookies.get('isLoggedin') || false;
  return (
    <div className="App">
      <Layout loggedIn={isLoggedin}>
        <Switch>
          <Route exact path='/' component={Login} />
          <ProtectedRoute path="/dashboard" loggedIn={isLoggedin} component={UserList} />
          <Route component={NotFound}/>
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
