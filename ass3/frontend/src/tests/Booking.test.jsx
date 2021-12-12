import { shallow } from 'enzyme';
import React from 'react';
// import renderer from 'react-test-renderer';
import Booking from '../components/Booking';
import { myDateFormat } from '../utils/helper';

describe('Booking', () => {
  const sampleBooking = {
    id: '1000',
    owner: '2@2.com',
    dateRange: {
      start: '2021-10-31T13:00:00.000Z',
      end: '2021-11-02T13:00:00.000Z'
    },
    totalPrice: '1500.00',
    listingId: '405208969',
    status: 'accepted'
  }
  const booking = shallow(<Booking key={0} idx={0} booking={sampleBooking}></Booking>);
  it('displays order number', () => {
    const orderNumber = ' Order number: ' + sampleBooking.id + ' ';
    expect(booking.find('.booking-info').at(0).childAt(0).text()).toBe(orderNumber);
  });

  it('displays booking owner', () => {
    const bookingOwner = ' Made by: ' + sampleBooking.owner + ' ';
    expect(booking.find('.booking-info').at(0).childAt(1).text()).toBe(bookingOwner);
  });

  it('displays booking dates', () => {
    const bookingDates = ' Date: ' + myDateFormat(sampleBooking.dateRange.start) + ' to ' + myDateFormat(sampleBooking.dateRange.end) + ' ';
    expect(booking.find('.booking-info').at(1).childAt(0).text()).toBe(bookingDates);
  });

  it('displays booking Offer price', () => {
    const bookingPrices = '$' + sampleBooking.totalPrice;
    expect(booking.find('.booking-info').at(1).childAt(1).find('Badge').text()).toBe(bookingPrices);
  });

  it('displays Accepted when booking is accepted', () => {
    const bookingStatus = 'Accepted'
    expect(booking.find('.justify-content-end').find('Badge').text()).toBe(bookingStatus);
  });

  it('displays Declined when booking is declined', () => {
    const bookingStatus = 'Declined';
    sampleBooking.status = 'declined';
    const declinedBooking = shallow(<Booking key={0} idx={0} booking={sampleBooking}></Booking>);
    expect(declinedBooking.find('.justify-content-end').find('Badge').text()).toBe(bookingStatus);
  });

  it('displays accept/deny button when booking is pending', () => {
    sampleBooking.status = 'pending';
    const declinedBooking = shallow(<Booking key={0} idx={0} booking={sampleBooking}></Booking>);
    expect(declinedBooking.find('.justify-content-end').childAt(0).text()).toBe('Accept');
    expect(declinedBooking.find('.justify-content-end').childAt(1).text()).toBe('Deny');
  });
});
