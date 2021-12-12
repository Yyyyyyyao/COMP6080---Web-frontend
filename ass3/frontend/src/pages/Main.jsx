import React from 'react'
import { Container } from 'react-bootstrap'
import SearchPar from '../components/SearchPar'
import ListingItem from '../components/ListingItem'
import { myfetch } from '../utils/helper'
import { StoreContext } from '../utils/ListingStore'
import './Main.css'
import PropTypes from 'prop-types'
const Main = ({ loginStatus }) => {
  const context = React.useContext(StoreContext);
  const [, setAllListings] = context.listings;
  const [allListingsWithDetail, setAllListingsWithDetail] = context.listingsWithDetail;
  const [, setAllBooking] = context.bookings;
  const [daysBook, setDaysBook] = React.useState('Any Day (Tick to choose date)');
  React.useEffect(async () => {
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
      // only published listing will be seen
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
  }, [loginStatus]);

  return (
    <Container>
      <SearchPar daysBook={ daysBook} setDaysBook={setDaysBook }/>
      <div className="px-2 overflow-auto">

      {
        // TODO ordering the listings
        allListingsWithDetail.map((aListing, idx) => {
          return <ListingItem key={idx} id={aListing.id.toString()} title={aListing.title} thumbnail={aListing.thumbnail} bedRoomNum={aListing.metadata.bedroom.length} toiletNum={aListing.metadata.bathroom} address={aListing.address} rating={aListing.reviews.length} price={aListing.price} daysBook={daysBook}/>
        })}
      </div>
    </Container>
  )
}
Main.propTypes = {
  loginStatus: PropTypes.bool

}
export default Main
