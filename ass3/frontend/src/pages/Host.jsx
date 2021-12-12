import React from 'react';
import './Host.css';
import HostHeader from '../components/HostHeader';
import HostListing from '../components/HostListing';
import ProfitChart from '../components/ProfitChart';
import ErrModal from '../components/ErrModal';
import { myfetch } from '../utils/helper';

function Host () {
  const [listings, setListings] = React.useState([]);
  const [showErr, setshowErr] = React.useState(false);
  const [errText, setErrMsg] = React.useState('');
  const [allBookings, setAllBookings] = React.useState([]);
  const [listingIds, setListingIds] = React.useState([]);

  const getListingInfo = async (listingId) => {
    try {
      const url = 'listings/' + listingId;
      const js = await myfetch('GET', url, null, null);
      return js.listing;
    } catch (error) {
      setshowErr(true);
      setErrMsg(error);
    }
  }

  React.useEffect(async () => {
    try {
      const js = await myfetch('GET', 'listings', null, null);
      const allListings = js.listings;
      const promistListings = {};
      for (const listing of allListings) {
        if (listing.owner === sessionStorage.getItem('email')) {
          const p = getListingInfo(listing.id);
          promistListings[listing.id] = p;
        }
      }
      const hostLisings = [];
      const hostListingIds = [];
      for (const [id, p] of Object.entries(promistListings)) {
        const listing = await p;
        listing.id = id;
        hostLisings.push(listing);
        hostListingIds.push(listing.id);
      }
      setListingIds(hostListingIds);
      setListings(hostLisings);
    } catch (error) {
      setshowErr(true);
      setErrMsg(error);
    }
  }, []);

  React.useEffect(async () => {
    try {
      const url = 'bookings/';
      const js = await myfetch('GET', url, sessionStorage.getItem('token'), null);
      setAllBookings(js.bookings);
    } catch (error) {
      setshowErr(true);
      setErrMsg(error);
    }
  }, []);

  return (
    <>
      {showErr && <ErrModal setShow={setshowErr} errMsg={errText} />}
      <HostHeader></HostHeader>
      <h1 className="d-flex justify-content-center">Profits made in last 30  days</h1>
      <ProfitChart allBookings={allBookings} listingIds={listingIds}></ProfitChart>
      <hr></hr>
      <h1 className="d-flex justify-content-center">My listings</h1>
      <div className="HostListings-container">
        {listings.map((listing, idx) => (
          <HostListing key={idx} listingId={listing.id} idx={idx} availability={listing.availability} published={listing.published} title={listing.title} address={listing.address} price={listing.price} thumbnail={listing.thumbnail} metadata={listing.metadata} reviews={listing.reviews} setListings={setListings} listings={listings}></HostListing>
        ))}
      </div>
    </>
  );
}

export default Host;
