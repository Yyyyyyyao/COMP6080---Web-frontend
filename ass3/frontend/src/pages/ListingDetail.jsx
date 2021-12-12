import React from 'react';
import './ListingDetail.css';
import { StoreContext } from '../utils/ListingStore';
import ToastComp from '../components/ToastComp';
import { Container, Row, Button, Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import ListReviewItem from '../components/ListReviewItem';
import { useParams, useHistory } from 'react-router-dom';
import { RatingView } from 'react-simple-star-rating';
import {
  BsFillHouseFill,
  BsPinMapFill,
  BsCurrencyDollar,
  BsFillCalendarDateFill,
} from 'react-icons/bs';
import { MdMeetingRoom, MdRateReview } from 'react-icons/md';
import {
  FaBed,
  FaToilet,
  FaSwimmingPool,
  FaParking,
} from 'react-icons/fa';
import { CgGym } from 'react-icons/cg';
import { GiBarbecue } from 'react-icons/gi';
import ListingDetailImg from '../components/ListingDetailImg';
import BookingCalender from '../components/BookingCalender';
import PropTypes from 'prop-types';
import ReviewModal from '../components/ReviewModal';
import { myfetch } from '../utils/helper';
import SubReviews from '../components/SubReviews';
const ListingDetail = ({ loginStatus }) => {
  const history = useHistory();
  const goto = (loc) => {
    history.push(loc);
  };
  // data range states for booking
  const [dateRange, setDateRange] = React.useState(1);
  // keep booking id
  const [bookingid, setBookingid] = React.useState('');
  // avg rating will change if a new review leaved
  const [totalRating, setTotalRating] = React.useState(0);
  // keep all rating details for advance feature
  const [ratingDetail, setRatingDetail] = React.useState({
    five: { num: 0, per: 0, rs: [] },
    four: { num: 0, per: 0, rs: [] },
    three: { num: 0, per: 0, rs: [] },
    two: { num: 0, per: 0, rs: [] },
    one: { num: 0, per: 0, rs: [] },
  });
  // state for advance feature, show different stars review
  const [whichSubReview, setWhichSubReview] = React.useState(0)
  const [showSubReview, setShowSubReview] = React.useState(false);

  // state if user just make a booking
  const [justBook, setJustBook] = React.useState(false);

  // state if user just make a review
  const [justReview, setJustReview] = React.useState(false);

  // show modal for user leave a review
  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const lid = useParams();
  const context = React.useContext(StoreContext);
  const [, setAllListings] = context.listings;
  const [allListingsWithDetail, setAllListingsWithDetail] =
    context.listingsWithDetail;
  const [allBooking, setAllBooking] = context.bookings;
  const [myBookingToThis, setMyBookingToThis] = React.useState([]);

  // filter this specific lising detail
  const detail = allListingsWithDetail.filter((l) => {
    if (l.id.toString() === lid.id) {
      return true;
    }
    return false;
  });
  // recaculate rating if new rating leaved
  React.useEffect(() => {
    let v = 0;
    let counter = 0;
    const rateDetail = {
      five: { num: 0, per: 0, rs: [] },
      four: { num: 0, per: 0, rs: [] },
      three: { num: 0, per: 0, rs: [] },
      two: { num: 0, per: 0, rs: [] },
      one: { num: 0, per: 0, rs: [] },
    }
    for (const r of detail[0].reviews) {
      v += parseFloat(r.rating);
      if (Math.round(parseFloat(r.rating)) === 5) {
        rateDetail.five.num++;
        rateDetail.five.rs.push(r);
      } else if (Math.round(parseFloat(r.rating)) === 4) {
        rateDetail.four.num++;
        rateDetail.four.rs.push(r);
      } else if (Math.round(parseFloat(r.rating)) === 3) {
        rateDetail.three.num++;
        rateDetail.three.rs.push(r);
      } else if (Math.round(parseFloat(r.rating)) === 2) {
        rateDetail.two.num++;
        rateDetail.two.rs.push(r);
      } else if (Math.round(parseFloat(r.rating)) === 1) {
        rateDetail.one.num++;
        rateDetail.one.rs.push(r);
      }
      counter++;
    }

    rateDetail.five.per = ((rateDetail.five.num / counter) * 100).toFixed(0);
    rateDetail.four.per = ((rateDetail.four.num / counter) * 100).toFixed(0);
    rateDetail.three.per = ((rateDetail.three.num / counter) * 100).toFixed(0);
    rateDetail.two.per = ((rateDetail.two.num / counter) * 100).toFixed(0);
    rateDetail.one.per = ((rateDetail.one.num / counter) * 100).toFixed(0);
    setRatingDetail(rateDetail);
    setTotalRating(Math.round(v / counter));
  }, [allListingsWithDetail]);
  React.useEffect(async () => {
    let myBooking = [];
    if (loginStatus) {
      const res = await myfetch(
        'get',
        'bookings',
        sessionStorage.getItem('token')
      );
      myBooking = res.bookings.filter((val) => {
        return sessionStorage.getItem('email') === val.owner;
      });
      setAllBooking(myBooking);
    } else {
      setAllBooking([]);
    }
    if (loginStatus) {
      const res = await myfetch('get', 'listings');
      setAllListings(res.listings);
      const detailLists = [];
      for (const list of res.listings) {
        const res = await myfetch(
          'get',
          `listings/${list.id}`,
          sessionStorage.getItem('token')
        );
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
            myBookingList.push(listing);
          } else {
            otherBookingList.push(listing);
          }
        }

        const orderedList = myBookingList.concat(otherBookingList);
        setAllListingsWithDetail(orderedList);
      } else {
        setAllListingsWithDetail(detailLists);
      }
    }
    if (justReview) {
      setJustReview(false);
    }
  }, [justReview, loginStatus]);

  // show booking calender for select dates
  const [showBookingCal, setShowBookingCal] = React.useState(false);
  // set all current user to this listing booking
  React.useEffect(() => {
    const copymyBookingToThis = [];
    for (const aBooking of allBooking) {
      if (aBooking.listingId === lid.id) {
        copymyBookingToThis.push({
          bookid: aBooking.id.toString(),
          status: aBooking.status,
        });
      }
    }
    setMyBookingToThis(copymyBookingToThis);
  }, [allBooking]);
  const [showMoreRating, setShowMoreRating] = React.useState(false)
  return (
    <>
      {showSubReview && <SubReviews reviewArr={
        whichSubReview === 5
          ? ratingDetail.five.rs
          : (whichSubReview === 4
              ? ratingDetail.four.rs
              : (whichSubReview === 3
                  ? ratingDetail.three.rs
                  : (whichSubReview === 2
                      ? ratingDetail.two.rs
                      : ratingDetail.one.rs)))
      } setShow={setShowSubReview} />
      }
      <ToastComp justBook={justBook} setJustBook={setJustBook} />
      {showReviewModal && (
        <ReviewModal
          id={lid.id}
          bookingid={bookingid}
          setShowReviewModal={setShowReviewModal}
          allListingsWithDetail={allListingsWithDetail}
          setAllListingsWithDetail={setAllListingsWithDetail}
          setJustReview={setJustReview}
        />
      )}
      <Container
        fluid
        className="ListingDetail-container d-flex  flex-column align-items-center"
      >
        <ListingDetailImg
          thumbnail={detail[0].thumbnail}
          hasImgs={'propertyImgs' in detail[0].metadata}
          imgArray={detail[0].metadata.propertyImgs}
        />

        <div className="ListingDetail-info d-flex flex-column px-3 justify-content-between flex-fill">
          <div className="border-bottom d-flex justify-content-between">
            {showBookingCal
              ? (
              <BookingCalender
                className="ListingDetailCalender"
                setJustBook={setJustBook}
                setShowCal={setShowBookingCal}
                listingId={lid.id}
                pricePerNight={parseFloat(detail[0].price)}
                  setDateRange={setDateRange}
              />
                )
              : (
              <>
                <h1 className="d-flex align-items-center ">
                  {detail[0].title}{' '}
                </h1>
                  <Button
                    name="bookNowBtn"
                  className="d-flex align-items-center"
                  onClick={() => {
                    if (loginStatus) {
                      setShowBookingCal(true);
                    } else {
                      goto('/login');
                    }
                  }}
                  variant="light"
                  size="sm"
                >
                  <BsFillCalendarDateFill className="mx-1" /> Book Now!{' '}
                </Button>
              </>
                )}
          </div>

          {myBookingToThis.map((val, idx) => {
            const bookStatus = val.status;
            return (
              <div
                key={idx}
                className="border-bottom d-flex align-items-center justify-content-between "
              >
                {bookStatus !== 'nobooking' && (
                  <>
                    <h6 className="d-flex my-3 align-items-center">Booking #{val.bookid} </h6>
                    {bookStatus !== 'nobooking' &&
                      (
                      <Badge
                        bg={
                          bookStatus === 'accepted'
                            ? 'success'
                            : bookStatus === 'declined'
                              ? 'danger'
                              : 'secondary'
                        }
                        className="align-self-center me-auto ms-1"
                        pill
                      >
                        {bookStatus}
                      </Badge>
                      )
                      }
                    {bookStatus === 'accepted' && (
                      <Button
                        name='rate-it-btn'
                        variant="outline-primary"
                        onClick={() => { setShowReviewModal(true); setBookingid(val.bookid); }}
                        className="d-flex align-items-center align-self-center"
                      >
                        <MdRateReview />
                        Rate it!
                      </Button>
                    )}
                  </>
                )}
              </div>
            );
          })}

          <Row className="border-bottom">
            <h5>
              <BsPinMapFill />
            </h5>
            <div className="d-flex align-items-center">{detail[0].address}</div>
          </Row>
          <Row className="border-bottom">
            <div className="d-flex align-items-center">
              <BsFillHouseFill /> {detail[0].metadata.propertyType}
              <FaToilet className="ms-auto" /> {detail[0].metadata.bathroom} bathroom
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <span className="">
                <MdMeetingRoom />
                {detail[0].metadata.bedroom.length} bedroom
              </span>
              <span className="">
                <FaBed /> 2 beds
                {JSON.stringify(detail[0].metadata.propertyType.bedroom)}
              </span>
            </div>
          </Row>
          <Row className="border-bottom">
            <div className="d-flex align-items-center justify-content-between">
              <span className="d-flex align-items-center">
                <CgGym className="hasFacility"/>

                {detail[0].metadata.amenities.gym
                  ? (<span className="ms-1 hasFacility"> Gym</span>
                    )
                  : (<span className="ms-1 hasFacility"><del> Gym</del></span>
                    )}

              </span>
              <span className="d-flex align-items-center">
                <FaSwimmingPool />
                {detail[0].metadata.amenities.pool
                  ? (<span className="ms-1 hasFacility"> Pool</span>
                    )
                  : (<span className="ms-1 hasFacility"><del> Pool</del></span>
                    )}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span className="d-flex align-items-center">
                <GiBarbecue />
                {detail[0].metadata.amenities.bbq
                  ? (<span className="ms-1 hasFacility"> BBQ</span>
                    )
                  : (<span className="ms-1 hasFacility"><del> BBQ</del></span>
                    )}
              </span>
              <span className="d-flex align-items-center">
                <FaParking />
                {detail[0].metadata.amenities.parking
                  ? (<span className="ms-1 hasFacility"> Parking</span>
                    )
                  : (<span className="ms-1 hasFacility"><del> Parking</del></span>
                    )}
              </span>
            </div>
          </Row>
          <div className="d-flex justify-content-between align-items-center  my-2">
            <OverlayTrigger show={showMoreRating} placement="top" overlay={
              <Popover onMouseEnter={() => setShowMoreRating(true)} onMouseLeave={() => setShowMoreRating(false)}>
              <Popover.Header as="h3">Rating Details</Popover.Header>
                <Popover.Body>
                  {/* <Container> */}
                  <div className="d-flex justify-content-between border-bottom my-2"><span>Percentage</span>        <span>Total</span></div>
                  <div onClick={() => { setShowSubReview(true); setWhichSubReview(5); setShowMoreRating(false) }} className="d-flex justify-content-between align-items-start rating-font" type="Button"><span className="flex-1"> {ratingDetail.five.per }% </span>  <RatingView className="flex-1" ratingValue={5} /> <span className="flex-1"> { ratingDetail.five.num } </span> </div>
                  <div onClick={() => { setShowSubReview(true); setWhichSubReview(4); setShowMoreRating(false) }} className="d-flex justify-content-between align-items-start rating-font" type="Button">{ratingDetail.four.per }% <RatingView ratingValue={4} />  { ratingDetail.four.num } </div>
                  <div onClick={() => { setShowSubReview(true); setWhichSubReview(3); setShowMoreRating(false) }} className="d-flex justify-content-between align-items-start rating-font" type="Button">{ratingDetail.three.per }% <RatingView ratingValue={3} /> { ratingDetail.three.num } </div>
                  <div onClick={() => { setShowSubReview(true); setWhichSubReview(2); setShowMoreRating(false) }} className="d-flex justify-content-between align-items-start rating-font" type="Button"><span className="flex-1"> {ratingDetail.two.per }%  </span><RatingView className="flex-1" ratingValue={2} /><span className="flex-1">  { ratingDetail.two.num }  </span></div>
                  <div onClick={() => { setShowSubReview(true); setWhichSubReview(1); setShowMoreRating(false) }} className="d-flex justify-content-between align-items-start rating-font" type="Button">{ratingDetail.one.per }% <RatingView ratingValue={1} /> { ratingDetail.one.num } </div>
                  {/* </Container> */}
              </Popover.Body>
              </Popover>
            }>

              <Button onClick={() => setShowMoreRating(!showMoreRating)} onMouseEnter={() => setShowMoreRating(true)} onMouseLeave={() => setShowMoreRating(false)} variant="light" className="d-flex  align-items-center">
              <RatingView ratingValue={totalRating} />
              </Button>
              </OverlayTrigger>
            <h3 className="d-flex align-items-center">
              <BsCurrencyDollar /> { (detail[0].price * dateRange).toFixed(0)}<small className=" text-muted"> /{dateRange} {dateRange === 1 ? 'day' : 'days'}</small>
            </h3>
          </div>
        </div>
        <ListReviewItem reviews={detail[0].reviews} />
      </Container>
    </>
  );
};
ListingDetail.propTypes = {
  loginStatus: PropTypes.bool,
};
export default ListingDetail;
