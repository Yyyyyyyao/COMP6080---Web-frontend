import React from 'react';
import PropTypes from 'prop-types';
import './Booking.css';
import { Badge, Button } from 'react-bootstrap'
import { myfetch, myDateFormat } from '../utils/helper'
import ErrModal from './ErrModal'

function Booking (props) {
  // Error pop initiate
  const [showErr, setshowErr] = React.useState(false);
  const [errText, setErrMsg] = React.useState('');

  // function to accept a pending booking
  // trigger when clicking the accept button
  const acceptBooking = async () => {
    try {
      const url = 'bookings/accept/' + props.booking.id;
      await myfetch('PUT', url, sessionStorage.getItem('token'), null);
      const newBookings = [...props.bookings];
      newBookings[props.idx].status = 'accepted';
      props.setBookings(newBookings);
    } catch (error) {
      setshowErr(true);
      setErrMsg(error);
    }
  };

  // function to decline a pending booking
  // trigger when clicking the deny button
  const denyBooking = async () => {
    try {
      const url = 'bookings/decline/' + props.booking.id;
      await myfetch('PUT', url, sessionStorage.getItem('token'), null);
      const newBookings = [...props.bookings];
      newBookings[props.idx].status = 'declined';
      props.setBookings(newBookings);
    } catch (error) {
      setshowErr(true);
      setErrMsg(error);
    }
  };

  return (
    <>
      {showErr && <ErrModal setShow={setshowErr} errMsg={errText} />}
      <div className="booking-container">
        <div className="booking-info">
          <div> Order number: <Badge>{props.booking.id}</Badge> </div>
          <div> Made by: <Badge>{props.booking.owner}</Badge> </div>
        </div>
        <div className="booking-info">
          <div> Date: <Badge>{myDateFormat(props.booking.dateRange.start)} to {myDateFormat(props.booking.dateRange.end)}</Badge> </div>
          <div> Offer: <Badge>${props.booking.totalPrice}</Badge> </div>
        </div>
        {props.booking.status === 'pending' &&
          <div className="d-flex justify-content-end pt-2">
            <Button name="accept-booking-btn" variant="outline-success" onClick={acceptBooking}>Accept</Button>
            <Button variant="outline-danger" onClick={denyBooking}>Deny</Button>
          </div>
        }
        {props.booking.status === 'accepted' &&
          <div className="d-flex justify-content-end pt-2">
            <Badge pill bg="success">Accepted</Badge>
          </div>
        }
        {props.booking.status === 'declined' &&
          <div className="d-flex justify-content-end pt-2">
            <Badge pill bg="danger">Declined</Badge>
          </div>
        }
      </div>
    </>
  )
}

Booking.propTypes = {
  idx: PropTypes.number,
  bookings: PropTypes.array,
  setBookings: PropTypes.func,
  booking: PropTypes.object,
}

export default Booking
