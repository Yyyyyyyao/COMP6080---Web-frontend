import React from 'react'
import PropTypes from 'prop-types'
export const StoreContext = React.createContext(null)

const ListingStore = ({ children }) => {
  const [allListings, setAllListings] = React.useState([]);

  // only published listing will be in allListingsWithDetail
  const [allListingsWithDetail, setAllListingsWithDetail] = React.useState([]);
  const [allBooking, setAllBooking] = React.useState([]);
  const [showErr, setShowErr] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const store = {
    listings: [allListings, setAllListings],
    listingsWithDetail: [allListingsWithDetail, setAllListingsWithDetail],
    bookings: [allBooking, setAllBooking],
    errModal: [showErr, setShowErr],
    errMsg: [errMsg, setErrMsg]
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
ListingStore.propTypes = {
  children: PropTypes.any
}
export default ListingStore;
