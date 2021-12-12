import React from 'react'
import './HostListing.css';
import { Button, ButtonGroup, Badge, Form } from 'react-bootstrap'
import { MdModeEdit, MdDeleteForever, MdBed, MdOutlineShower, MdRateReview } from 'react-icons/md';
import PropTypes from 'prop-types';
import { myfetch, myDateFormat, getTotalRating, isBase64 } from '../utils/helper';
import DeleteModal from './DeleteModal';
import { useHistory } from 'react-router-dom';
import ErrModal from './ErrModal';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useMediaQuery } from 'react-responsive';
import { AiFillStar } from 'react-icons/ai';
import ReactPlayer from 'react-player';

function HostListing (props) {
  const history = useHistory();

  // State used to see whether to display the comfirm delete modal
  // when user clicked the delete listing button
  const [showDelConfirm, setshowDelConfirm] = React.useState(false);

  // State used to store the listing publish status
  const [publishStatus, setPublishStatus] = React.useState(props.published);

  // Error modal initiate
  const [showErr, setshowErr] = React.useState(false);
  const [errText, setErrMsg] = React.useState('');

  // Store an array of date ranges
  // Built-in variable used in <DateRange>
  const [datePickers, setDatePickers] = React.useState([]);

  // Store date range objects
  // Built-in variable used in <DateRange>
  const [state, setState] = React.useState({});

  // Boolean State used to check whether to show the calendar
  const [showCalendar, setShowCalendar] = React.useState(false);

  // For the purpose of mobilbility
  const isSmallView = useMediaQuery({
    query: '(max-width: 600px)'
  })

  // Update the datepicker array
  // after user select or change a date
  // which changes the state
  React.useEffect(() => {
    const newPickers = [];
    for (const key in state) {
      newPickers.push(state[key]);
    }
    setDatePickers(newPickers);
  }, [state]);

  // Function to add date picker
  // to allow user choose multiple publish dates
  const addDatePicker = () => {
    const pickerIndex = datePickers.length + 1;
    const newState = { ...state };
    newState[pickerIndex] = {
      startDate: new Date(),
      endDate: new Date(),
      color: '#3d91ff',
      key: pickerIndex.toString(),
    };
    setShowCalendar(true);
    setState(newState);
  }

  // Function to clear all the selected dates
  const clearDatePicker = () => {
    setState({});
  }

  // Function to delete listing
  const handleDelete = async () => {
    try {
      const url = 'listings/' + props.listingId;
      await myfetch('DELETE', url, sessionStorage.getItem('token'), null);
      const newListings = [...props.listings];
      newListings.splice(props.idx, 1);
      props.setListings(newListings);
    } catch (error) {
      setshowErr(true);
      setErrMsg(error);
    }
  }

  // Function to direct path to edit page
  // when clicking the edit listing button
  const handleEdit = () => {
    const path = '/editListing/' + props.listingId;
    history.push(path);
  }

  // Function to direct path to view booking page
  // when clicking the view bookings button
  const handleBooking = () => {
    const path = '/hostBooking/' + props.listingId;
    history.push(path);
  }

  // Function to unpublish a listing
  // when clicking the unpublish button
  const handleUnpublish = async () => {
    setPublishStatus(!publishStatus);
    try {
      const url = 'listings/unpublish/' + props.listingId;
      await myfetch('PUT', url, sessionStorage.getItem('token'), null);
      const newListings = [...props.listings];
      newListings[props.idx].published = false;
      props.setListings(newListings);
    } catch (error) {
      setshowErr(true);
      setErrMsg(error);
    }
  }

  // Function to publish a listing
  // when clicking the publish button
  // validation checking that
  // user cannot select overlapping dates
  const handlePublish = async (event) => {
    event.preventDefault();
    const newAvailability = [];
    for (const key in state) {
      const dateRange = {
        start: state[key].startDate,
        end: state[key].endDate,
      };
      newAvailability.push(dateRange);
    }
    newAvailability.sort((a, b) => (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0))
    const body = {
      availability: newAvailability,
    };
    if (newAvailability.length === 0) {
      setshowErr(true);
      setErrMsg('Please enter availability dates by clicking Add Dates Button');
    } else {
      let dateValid = true;
      newAvailability.forEach((range, idx) => {
        if (idx < newAvailability.length - 1 && range.end > newAvailability[idx + 1].start) {
          dateValid = false;
        }
      });
      if (dateValid) {
        try {
          const url = 'listings/publish/' + props.listingId;
          await myfetch('PUT', url, sessionStorage.getItem('token'), body);
          const newListings = [...props.listings];
          newListings[props.idx].published = true;
          newListings[props.idx].availability = newAvailability;
          props.setListings(newListings);
          setPublishStatus(!publishStatus);
        } catch (error) {
          setshowErr(true);
          setErrMsg(error);
        }
      } else {
        setshowErr(true);
        setErrMsg('Please do not enter overlapping dates');
      }
    }
  }

  return (
    <>
    {showErr && <ErrModal setShow={setshowErr} errMsg={errText} />}
    {showDelConfirm && <DeleteModal setShow={setshowDelConfirm} handler={handleDelete}/>}
    <div className="Listing-card">
      {!isSmallView && <div className="Listing-container">
        <div>
          {/* <img src={props.thumbnail} alt="tt" width="150" height="150"/> */}
          {isBase64(props.thumbnail) && <img src={props.thumbnail} alt="tt" width="150" height="150"/>}
          {!isBase64(props.thumbnail) && <ReactPlayer url={props.thumbnail} width="150px" height="150px"/>}
        </div>
        <div className="Listing-middle">
          <div className="Listing-middle-title">
            <h2>
              {props.title}
            </h2>
            <small>
              <Badge bg="secondary">{props.metadata.propertyType}</Badge>
            </small>
          </div>
          <div className="Listing-middle-details">
            <Badge pill bg="light" text="dark"><MdBed></MdBed>{props.metadata.bedroom.length}</Badge>
            <Badge pill bg="light" text="dark"><MdOutlineShower></MdOutlineShower>{props.metadata.bathroom}</Badge>
          </div>
        </div>
        <div>
          <h2>${props.price}<small>/night</small></h2>
        </div>
        <div className="Listing-last">
          <div>
            <h5>
              <AiFillStar></AiFillStar> {getTotalRating(props.reviews)}
            </h5>
            <h5>
              <MdRateReview></MdRateReview> {props.reviews.length}
            </h5>
          </div>

          <ButtonGroup className="mt-2" aria-label="Second group">
            <Button variant="outline-primary" size="sm" onClick={() => { handleEdit() }}><MdModeEdit></MdModeEdit></Button>
            <Button variant="outline-danger"size="sm" onClick={() => { setshowDelConfirm(true); }}><MdDeleteForever></MdDeleteForever></Button>
          </ButtonGroup>
        </div>

      </div>}

      {isSmallView &&
      <div className="Listing-container">
        <div className="Listing-thumbnail-mobile">
          {/* <img src={props.thumbnail} alt="tt" width="80%" height="80%"/> */}
          {isBase64(props.thumbnail) && <img src={props.thumbnail} alt="tt" width="80%" height="80%"/>}
          {!isBase64(props.thumbnail) && <ReactPlayer url={props.thumbnail} width="80%" height="80%"/>}
        </div>
        <div className="Listing-info-mobile">
          <div className="Listing-up-mobile">
            <div className="Listing-middle-title">
              <h2>
                {props.title}
              </h2>
              <small>
                <Badge bg="secondary">{props.metadata.propertyType}</Badge>
              </small>
              <div>
                <Badge pill bg="light" text="dark"><MdBed></MdBed>{props.metadata.bedroom.length}</Badge>
                <Badge pill bg="light" text="dark"><MdOutlineShower></MdOutlineShower>{props.metadata.bathroom}</Badge>
              </div>
            </div>
            <div>
              <h2>${props.price}<small>/night</small></h2>
            </div>
          </div>

          <div className="Listing-bot-mobile">
            <h5>
              <AiFillStar></AiFillStar> {getTotalRating(props.reviews)}
            </h5>
            <h5>
              <MdRateReview></MdRateReview> {props.reviews.length}
            </h5>
          </div>

          <div className="Listing-btns-mobile">
            <ButtonGroup className="mt-2" aria-label="Second group">
              <Button variant="outline-primary" size="sm" onClick={() => { handleEdit() }}><MdModeEdit></MdModeEdit></Button>
              <Button variant="outline-danger"size="sm" onClick={() => { setshowDelConfirm(true); }}><MdDeleteForever></MdDeleteForever></Button>
            </ButtonGroup>
          </div>

        </div>

      </div>}

      {publishStatus &&
        <div>
          <div className="Listing-publish-info">
            <Button name="unpublishBtn" size="sm" variant="outline-warning" onClick={handleUnpublish}>To Unpublish</Button>
            <div>
              {props.availability.map((range, idx) => {
                return (
                  <small key={idx}> <Badge bg="primary">{myDateFormat(range.start)} to {myDateFormat(range.end)}</Badge></small>
                )
              })}
            </div>

          </div>
          <div className="Listing-booking">
            <Button name="viewBookingBtn" size="sm" variant="outline-primary" onClick={handleBooking}>View Bookings</Button>
          </div>
        </div>
        }
      {!publishStatus &&
        <div>
          <Form onSubmit={handlePublish} className="date-form">
            <div className="d-flex justify-content-end">
              <Button name="publishBtn" variant="outline-warning" size="sm" type="submit">To Publish</Button>
            </div>
            <div>
              <Button name="addDatePicker" size="sm" variant="outline-primary" onClick={addDatePicker}>Add Dates</Button>
              <Button size="sm" variant="outline-danger" onClick={clearDatePicker}>Clear</Button>
              {showCalendar && <DateRange
                editableDateInputs={true}
                onChange={item => setState({ ...state, ...item })}
                ranges={datePickers}

              />}

            </div>

          </Form>
        </div>
      }
    </div>
    </>
  )
}

HostListing.propTypes = {
  listingId: PropTypes.string,
  idx: PropTypes.number,
  published: PropTypes.bool,
  availability: PropTypes.array,
  title: PropTypes.string,
  address: PropTypes.string,
  price: PropTypes.string,
  thumbnail: PropTypes.string,
  metadata: PropTypes.object,
  reviews: PropTypes.array,
  setListings: PropTypes.func,
  listings: PropTypes.array,
}
export default HostListing
