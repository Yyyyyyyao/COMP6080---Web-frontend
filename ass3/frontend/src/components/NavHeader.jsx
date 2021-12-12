import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { BsPersonCircle, BsHouseFill } from 'react-icons/bs'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types';
import './NavHeader.css'

import { StoreContext } from '../utils/ListingStore';
import { myfetch } from '../utils/helper';
const NavHeader = ({ loginStatus, setLoginStatue }) => {
  const history = useHistory();
  const goto = (loc) => {
    history.push(loc);
  }

  const context = React.useContext(StoreContext);
  const [, setAllListings] = context.listings;
  const [, setAllListingsWithDetail] = context.listingsWithDetail;
  const [, setAllBooking] = context.bookings;
  // click home will reset the listings
  const resetListings = async () => {
    let myBooking = [];
    if (loginStatus) {
      const res = await myfetch('get', 'bookings', sessionStorage.getItem('token'));
      myBooking = res.bookings.filter((val) => {
        return (sessionStorage.getItem('email') === val.owner);
      });
      setAllBooking(myBooking);
    } else {
      setAllBooking([]);
    }
    const res = await myfetch('get', 'listings');
    setAllListings(res.listings);
    const detailLists = [];
    for (const list of res.listings) {
      const res = await myfetch('get', `listings/${list.id}`, sessionStorage.getItem('token'));
      // only published will be seen
      if (res.listing.published) {
        res.listing.id = list.id;
        detailLists.push(res.listing);
      }
    }

    if (myBooking.length !== 0) {
      const myBookingList = [];
      const otherBookingList = [];
      const bookingslid = myBooking.map((val) => {
        return val.listingId;
      });
      for (const listing of detailLists) {
        if (bookingslid.includes(listing.id.toString())) {
          myBookingList.push(listing)
        } else {
          otherBookingList.push(listing)
        }
      }

      const orderedList = myBookingList.concat(otherBookingList);
      setAllListingsWithDetail(orderedList);
    } else {
      setAllListingsWithDetail(detailLists);
    }
  };

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>

          <Navbar.Brand type="button" className="d-flex align-items-center" onClick={() => { resetListings(); goto('/') }}>
            <BsHouseFill type="button" />
            AirBrB
          </Navbar.Brand>
          <Nav className="">
            <Nav.Link name="home" onClick={() => { resetListings(); goto('/') }}>Home</Nav.Link>
            <Nav.Link name="myHosting" onClick={() => {
              if (!loginStatus) {
                goto('/login');
              } else {
                goto('/host');
              }
            }}>My hosting</Nav.Link>

            <NavDropdown className="NavHeader-dropdown" title={loginStatus ? sessionStorage.getItem('email') : <> User <BsPersonCircle /> </>} id="basic-nav-dropdown">

              {loginStatus && <NavDropdown.Item name="navbar-logout-btn" onClick={() => { resetListings(); goto('/'); setLoginStatue(false); sessionStorage.clear();/* TODO reset list */ }}>Log out</NavDropdown.Item>}
              {!loginStatus && <> <NavDropdown.Item name="navbar-login-btn" onClick={() => goto('/login')} >Log in</NavDropdown.Item>
                <NavDropdown.Item name="navbar-signup-btn" onClick={() => goto('/register')} >Sign up</NavDropdown.Item></>}

            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
};

NavHeader.propTypes = {
  loginStatus: PropTypes.bool,
  setLoginStatue: PropTypes.func
};

export default NavHeader;
