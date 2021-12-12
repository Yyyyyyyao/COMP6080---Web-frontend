import React from 'react';
import PropTypes from 'prop-types'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import { Button, Container } from 'react-bootstrap';
import { myfetch, getDaysBetween } from '../utils/helper'
import { StoreContext } from '../utils/ListingStore';
import ErrModal from './ErrModal';

const BookingCalender = ({ setShowCal, listingId, pricePerNight, setJustBook, setDateRange }) => {
  const context = React.useContext(StoreContext);
  const [showErr, setShowErr] = context.errModal;

  const [errMsg, setErrMsg] = context.errMsg;
  const [, setAllBooking] = context.bookings;
  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  React.useEffect(() => {
    setDateRange(parseInt(getDaysBetween(state[0].startDate, state[0].endDate), 10));
  }, [state]);
  const makeBookingReq = async () => {
    console.log(sessionStorage);
    const body = {
      dateRange: {
        start: state[0].startDate,
        end: state[0].endDate
      },
      totalPrice: (pricePerNight * (getDaysBetween(state[0].startDate, state[0].endDate))).toFixed(2)
    }

    try {
      await myfetch('post', `bookings/new/${listingId}`, sessionStorage.getItem('token'), body);
      setShowCal(false);
      // change booking state
      const res = await myfetch('get', 'bookings', sessionStorage.getItem('token'));
      const myBooking = res.bookings.filter((val) => {
        return (sessionStorage.getItem('email') === val.owner);
      });
      setAllBooking(myBooking);
      setJustBook(true);
    } catch (err) {
      setErrMsg(err);
      setShowErr(true);
      console.log(err)
    }
  }

  return (
    <>
      {showErr && <ErrModal setShow={setShowErr} errMsg={errMsg} />}
      <Container className="text-center d-flex flex-column">
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={state}
          fixedHeight={true}
          disabledDates={[

          ]}
        />
        <div className=" d-flex justify-content-between">
          <Button size="sm" variant="secondary" onClick={() => setShowCal(false)}>Cancel</Button>
          <Button name="calenderbookingBtn" size="sm" variant="outline-primary" onClick={() => makeBookingReq()}>Booking</Button>
        </div>
      </Container>
    </>
  );
};

BookingCalender.propTypes = {
  setShowCal: PropTypes.func,
  listingId: PropTypes.string,
  pricePerNight: PropTypes.number,
  justBook: PropTypes.bool,
  setJustBook: PropTypes.func,
  setDateRange: PropTypes.func
}

export default BookingCalender;
