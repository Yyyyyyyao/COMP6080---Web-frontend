import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Host from './pages/Host';
import Main from './pages/Main';
import NavHeader from './components/NavHeader';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateListing from './pages/CreateListing';
import ListingStore from './utils/ListingStore';
import ListingDetail from './pages/ListingDetail';
import EditListing from './pages/EditListing';
import ListingBookings from './pages/ListingBookings';

function App () {
  const [isLogin, setIsLogin] = React.useState(false);

  return (
    <>

      <ListingStore>

        <BrowserRouter>
          <NavHeader loginStatus={isLogin} setLoginStatue={setIsLogin} />
          <Switch>
            <Route exact path="/">
              <Main loginStatus={isLogin} />
            </Route>
            <Route path="/about">
              <div>About</div>
            </Route>
            {/* Route to host page */}
            <Route exact path="/host">
              <Host></Host>
            </Route>
            <Route path="/register">
              <Register
                loginStatus={isLogin}
                setLoginStatue={setIsLogin}
              ></Register>
            </Route>

            <Route path="/login">
              <Login loginStatus={isLogin} setLoginStatue={setIsLogin} />
            </Route>

            <Route path="/createListing">
              <CreateListing></CreateListing>
            </Route>

            <Route path="/listingDetail/:id">
              <ListingDetail loginStatus={isLogin}></ListingDetail>
            </Route>

            <Route path="/editListing/:id">
              <EditListing></EditListing>
            </Route>

            <Route path="/hostBooking/:id">
              <ListingBookings></ListingBookings>
            </Route>
          </Switch>
        </BrowserRouter>
      </ListingStore>
    </>
  );
}

export default App;
