import React from 'react';
import { myfetch } from '../utils/helper';
import ErrModal from '../components/ErrModal';
import { useParams } from 'react-router-dom';
import Booking from '../components/Booking';
import { Accordion, Badge } from 'react-bootstrap';

function ListingBookings () {
  const [allBookings, setAllBookings] = React.useState([]);
  const [showErr, setshowErr] = React.useState(false);
  const [errText, setErrMsg] = React.useState('');
  const [listing, setListing] = React.useState({});
  const [onlineDuration, setOnlineDuration] = React.useState(0);
  const [daysBooked, setDaysBooked] = React.useState(0);
  const [profitsMade, setProfitsMade] = React.useState(0);
  const { id } = useParams(); // which is the listing id

  // get all bookings
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

  // get listing information
  React.useEffect(async () => {
    try {
      const url = 'listings/' + id;
      const js = await myfetch('GET', url, null, null);
      setListing(js.listing);
    } catch (error) {
      setshowErr(true);
      setErrMsg(error);
    }
  }, []);

  React.useEffect(() => {
    if (JSON.stringify(listing) !== JSON.stringify({})) {
      const postedDate = new Date(listing.postedOn);
      const now = Date.now();
      const timeDiff = now - postedDate;
      const duration = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setOnlineDuration(duration);
    }
  }, [listing]);

  // calculate the statistics again
  // if a booking has changed
  // and also filter the bookings
  // because we only want the related bookings
  React.useEffect(() => {
    if (allBookings.length !== 0) {
      let totalBooked = 0;
      let totalProfits = 0;
      for (const booking of allBookings) {
        const startDate = new Date(booking.dateRange.start);
        const endDate = new Date(booking.dateRange.end);
        const today = new Date();
        const thisYear = today.getFullYear();
        const bookingYear = endDate.getFullYear();
        if (booking.listingId === id.toString() && booking.status === 'accepted' && thisYear === bookingYear) {
          const timeDiff = endDate - startDate;
          totalBooked += Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
          totalProfits += parseInt(booking.totalPrice);
        }
      }
      setDaysBooked(totalBooked);
      setProfitsMade(totalProfits);
    }
  }, [allBookings]);

  return (
    <>
      {showErr && <ErrModal setShow={setshowErr} errMsg={errText} />}
      <div className="d-flex flex-column align-items-center">
        <h1>Statistics for this listing</h1>
        <div>
          This Listing has been online for <h3 className="d-inline"><Badge>{onlineDuration}</Badge></h3> days
        </div>
        <hr />
        <div>
          <h3 className="d-inline"><Badge>{daysBooked}</Badge></h3> days have been booked in this year
        </div>
        <hr />
        <div>
          <h3 className="d-inline"><Badge>${profitsMade}</Badge></h3> have been made in this year
        </div>
      </div>
      <hr />
      <h1 className="d-flex justify-content-center">Bookings for this listing</h1>
      <Accordion>
        <Accordion.Item name="pending-req-btn" eventKey="0">
          <Accordion.Header>Pending Requests</Accordion.Header>
          <Accordion.Body>
            <div>
              {allBookings.map((booking, idx) => {
                return (
                  booking.listingId === id.toString() && booking.status === 'pending' && <Booking key={idx} idx={idx} bookings={allBookings} setBookings={setAllBookings} booking={booking}></Booking>
                )
              })}
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Finished Requests</Accordion.Header>
          <Accordion.Body>
            <div>
            {allBookings.map((booking, idx) => {
              return (
                booking.listingId === id.toString() && booking.status !== 'pending' && <Booking key={idx} idx={idx} bookings={allBookings} setBookings={setAllBookings} booking={booking}></Booking>
              )
            })}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>

  )
}

export default ListingBookings
