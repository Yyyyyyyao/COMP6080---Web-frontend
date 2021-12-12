import React from 'react'
import { DateRange } from 'react-date-range';
import { Form, InputGroup, FormControl, Button, Accordion } from 'react-bootstrap'
import { MdAttachMoney, MdBedroomParent, MdOutlineDateRange, MdOutlineStarPurple500 } from 'react-icons/md'
import { StoreContext } from '../utils/ListingStore';
import { myfetch, getDaysBetween } from '../utils/helper';
import './SearchPar.css'
import PropTypes from 'prop-types'

const SearchPar = ({ daysBook, setDaysBook }) => {
  const [enableDateFilter, setEnableDateFilter] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    },
  ]);
  // set days filtered
  React.useEffect(() => {
    if (enableDateFilter) {
      setDaysBook(getDaysBetween(state[0].startDate, state[0].endDate).toString() + ' Day');
    } else {
      setDaysBook('Any Day (tick to choose date)');
    }
  }, [enableDateFilter, state])
  const context = React.useContext(StoreContext);
  const [allBooking] = context.bookings;
  const [, setAllListings] = context.listings;
  const [, setAllListingsWithDetail] = context.listingsWithDetail;
  const [validated, setValidated] = React.useState({
    bedroomInValid: false,
    bedErrMsg: '',
    priceInValid: false,
    priceErrMsg: '',
    ratingInValid: false,
    ratingErrMsg: '',
    dateInValid: false,
    dateErrMsg: ''
  });
  // check each field validations
  const checkValidation = (e) => {
    e.preventDefault();
    setValidated({
      bedroomInValid: false,
      bedErrMsg: '',
      priceInValid: false,
      priceErrMsg: '',
      ratingInValid: false,
      ratingErrMsg: '',
      dateInValid: false,
      dateErrMsg: ''
    });
    const cp = validated;
    if (e.target.SearchParMinBed.value !== '' && e.target.SearchParMaxBed.value !== '' && e.target.SearchParMinBed.value > e.target.SearchParMaxBed.value) {
      cp.bedroomInValid = true;
      cp.bedErrMsg = 'Left number should be less than right';
      setValidated(cp)
    }
    if (e.target.SearchParMinBed.value !== '' && parseInt(e.target.SearchParMinBed.value, 10) < 0) {
      cp.bedroomInValid = true;
      cp.bedErrMsg = 'Should be >= 0';
      setValidated(cp);
    }
    if (e.target.SearchParMaxBed.value !== '' && parseInt(e.target.SearchParMaxBed.value, 10) < 0) {
      cp.bedroomInValid = true;
      cp.bedErrMsg = 'Should be >= 0';
      setValidated(cp);
    }

    if (e.target.SearchParMinPrice.value !== '' && e.target.SearchParMaxPrice.value !== '' && e.target.SearchParMinPrice.value > e.target.SearchParMaxPrice.value) {
      cp.priceInValid = true;
      cp.priceErrMsg = 'Left number should be less than right';
      setValidated(cp);
    }
    if (e.target.SearchParMinPrice.value !== '' && parseInt(e.target.SearchParMinPrice.value, 10) < 0) {
      cp.priceInValid = true;
      cp.priceErrMsg = 'Should be >= 0';
      setValidated(cp);
    }
    if (e.target.SearchParMaxPrice.value !== '' && parseInt(e.target.SearchParMaxPrice.value, 10) < 0) {
      cp.priceInValid = true;
      cp.priceErrMsg = 'Should be >= 0';
      setValidated(cp);
    }

    if (e.target.SearchParMinRatingNum.value !== '' && e.target.SearchParMaxRatingNum.value !== '' && e.target.SearchParMinRatingNum.value > e.target.SearchParMaxRatingNum.value) {
      cp.ratingInValid = true;
      cp.ratingErrMsg = 'Left number should be less than right';
      setValidated(cp);
    }
    if (e.target.SearchParMinRatingNum.value !== '' && parseInt(e.target.SearchParMinRatingNum.value, 10) < 0) {
      cp.ratingInValid = true;
      cp.ratingErrMsg = 'Should be >= 0';
      setValidated(cp);
    }
    if (e.target.SearchParMaxRatingNum.value !== '' && parseInt(e.target.SearchParMaxRatingNum.value, 10) < 0) {
      cp.ratingInValid = true;
      cp.ratingErrMsg = 'Should be >= 0';
      setValidated(cp);
    }
  }
  // get filtered results
  const handleFilter = async (e) => {
    e.preventDefault();

    const res = await myfetch('get', 'listings');
    setAllListings(res.listings);
    let detailLists = [];
    for (const list of res.listings) {
      const res = await myfetch('get', `listings/${list.id}`, sessionStorage.getItem('token'));
      // only published will be seen
      if (res.listing.published) {
        res.listing.id = list.id;
        detailLists.push(res.listing);
      }
    }

    if (allBooking.length !== 0) {
      const myBookingList = [];
      const otherBookingList = [];
      const bookingslid = allBooking.map((val) => {
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
      detailLists = orderedList;
    }

    const searchText = e.target.SearchParInput.value.toLowerCase();
    if (searchText !== '') {
      detailLists = detailLists.filter((l) => {
        return l.title.toLowerCase().includes(searchText) || l.address.toLowerCase().includes(searchText);
      });
    }

    if (e.target.SearchParMinBed.value !== '') {
      detailLists = detailLists.filter((l) => {
        return l.metadata.bedroom.length >= parseInt(e.target.SearchParMinBed.value, 10);
      });
    }

    if (e.target.SearchParMaxBed.value !== '') {
      detailLists = detailLists.filter((l) => {
        return l.metadata.bedroom.length <= parseInt(e.target.SearchParMaxBed.value, 10);
      });
    }
    if (e.target.SearchParMinPrice.value !== '') {
      detailLists = detailLists.filter((l) => {
        return parseInt(l.price, 10) >= parseInt(e.target.SearchParMinPrice.value, 10);
      });
    }
    if (e.target.SearchParMaxPrice.value !== '') {
      detailLists = detailLists.filter((l) => {
        return parseInt(l.price, 10) <= parseInt(e.target.SearchParMaxPrice.value, 10);
      });
    }

    if (enableDateFilter) {
      detailLists = detailLists.filter((l) => {
        for (const ava of l.availability) {
          const start = new Date(ava.start);
          const end = new Date(ava.end);
          if (start <= state[0].startDate && end >= state[0].endDate) {
            return true;
          }
        }
        return false;
      });
    }
    if (e.target.SearchParMinRatingNum.value !== '') {
      detailLists = detailLists.filter((l) => {
        let v = 0;
        let counter = 0;
        for (const r of l.reviews) {
          v += parseFloat(r.rating);
          counter++;
        }
        let res = Math.round(v / counter);
        if (counter === 0) {
          res = 0;
        }
        if (res >= parseInt(e.target.SearchParMinRatingNum.value, 10)) {
          l.metadata.totalratingForSearch = Math.round(v / counter);
          return true;
        }
        return false;
      });
      detailLists.sort((l1, l2) =>
        l2.metadata.totalratingForSearch - l1.metadata.totalratingForSearch
      )
    }

    if (e.target.SearchParMaxRatingNum.value !== '') {
      detailLists = detailLists.filter((l) => {
        let v = 0;
        let counter = 0;
        for (const r of l.reviews) {
          v += parseFloat(r.rating);
          counter++;
        }
        let res = Math.round(v / counter);
        if (counter === 0) {
          res = 0;
        }
        if (res <= parseInt(e.target.SearchParMaxRatingNum.value, 10)) {
          l.metadata.totalratingForSearch = Math.round(v / counter);
          return true;
        }
        return false;
      });

      detailLists.sort((l1, l2) =>
        l2.metadata.totalratingForSearch - l1.metadata.totalratingForSearch
      )
    }

    setAllListingsWithDetail(detailLists);
  }

  return (
        <>
      <Form onSubmit={(e) => {
        checkValidation(e);
        handleFilter(e);
      }} >
            <InputGroup className="mt-3 mb-1">
              <FormControl
                placeholder="Title or address ..."
                aria-label="Title or address"
                aria-describedby="search title or address"
                name="SearchParInput"
              />
              <Button variant="outline-secondary" id="search-btn" type="submit">
                Search
              </Button>
            </InputGroup>
            <Accordion className="mb-3" defaultActiveKey="0">
              <Accordion.Item eventKey="1">
                <Accordion.Header>More filters</Accordion.Header>
            <Accordion.Body>
              <InputGroup className="mb-1">

                <InputGroup.Checkbox value={enableDateFilter} aria-label="Checkbox for following text input" onClick={() => {
                  setEnableDateFilter(!enableDateFilter);
                }} />
                <InputGroup.Text> {daysBook}</InputGroup.Text>
                {enableDateFilter && <Button className="SearchParToggleCal d-flex align-items-center justify-content-center" onClick={() => setShowSearch(!showSearch)} variant="primary"> <MdOutlineDateRange />{showSearch && enableDateFilter ? 'Hide' : 'Show'} Calender</Button>}

                  {showSearch && enableDateFilter && <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setState([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                  fixedHeight={true}

                    disabledDates={[

                    ]}
                  />}

                </InputGroup>
                  <InputGroup className="mb-1">
                    <InputGroup.Text> <MdBedroomParent/></InputGroup.Text>
                    <FormControl name="SearchParMinBed" controlid="minBed" aria-label="Min Number bedroom" min={0} placeholder="min" type="number" />
                    <FormControl name="SearchParMaxBed" controlid="maxBed" aria-label="Max Number bedroom" min={0} placeholder="max" type="number" />
                    {validated.bedroomInValid && <div name="bedError" className="SearchPar-err-msg"> { validated.bedErrMsg}</div>}
                  </InputGroup>
                  <InputGroup className="mb-1">
                    <InputGroup.Text><MdAttachMoney /></InputGroup.Text>
                    <FormControl name="SearchParMinPrice" controlid="minPrice" aria-label="Min price " min={0} placeholder="min" type="number"/>
                    <FormControl name="SearchParMaxPrice" controlid="maxPrice" aria-label="Max price " min={0} placeholder="max" type="number"/>
                    {validated.priceInValid && <div name="priceError" className="SearchPar-err-msg"> { validated.priceErrMsg}</div>}
                </InputGroup>

                  <InputGroup className="mb-1">
                    <InputGroup.Text><MdOutlineStarPurple500/></InputGroup.Text>
                    <FormControl name="SearchParMinRatingNum" controlid="minNumRating" aria-label="Min rating" min={0} placeholder="min" type="number" step="0.1"/>
                    <FormControl name="SearchParMaxRatingNum" controlid="maxNumRating" aria-label="max rating" min={0} max={5} placeholder="max" type="number" step="0.1"/>
                    {validated.ratingInValid && <div name="ratingError" className="SearchPar-err-msg"> { validated.ratingErrMsg}</div>}
                </InputGroup>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

        </Form>
        </>
  )
}
SearchPar.propTypes = {
  daysBook: PropTypes.string,
  setDaysBook: PropTypes.func
}
export default SearchPar
