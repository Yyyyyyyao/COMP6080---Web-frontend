import React from 'react'
import defaultThumb from './house.svg';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap'
import { MdRateReview, MdLocationPin, MdBed, MdOutlineShower } from 'react-icons/md';
import './ListingItem.css'
import { useHistory } from 'react-router-dom';
import { isBase64 } from '../utils/helper';
import ReactPlayer from 'react-player'
function ListingItem ({ id, title, thumbnail, address, rating, price, bedRoomNum, toiletNum, daysBook }) {
  const history = useHistory();
  const goto = (loc) => {
    history.push(loc);
  }

  return (
    <div className="ListingItem-card" onClick={() => { goto(`/listingDetail/${id}`); }}>
      <div>
        {isBase64(thumbnail)
          ? <img className="ListingItem-img" src={(thumbnail === '' || thumbnail === null) ? defaultThumb : thumbnail} alt="house preview image" width="150" height="150" />
          : <ReactPlayer className="ListingItem-video" width="150px" height="150px" url={thumbnail} />
        }

      </div>
      <div className="ms-2 ListingItem-middle">
        <div className="ListingItem-middle-title">
          <h2 className="ListingItem-h2">
            {title}
          </h2>

        </div>
        <div className="">
          <Badge className="ms-1" pill bg="light" text="dark"><MdBed></MdBed>{bedRoomNum}</Badge>
          <Badge className="ms-1" pill bg="light" text="dark"><MdOutlineShower></MdOutlineShower>{toiletNum}</Badge>
        </div>
        <div className="ListingItem-middle-details">

          <div className="ListingItem-p"><MdLocationPin/>  {address}</div>

        </div>
      </div>
      <div className="ListingItem-last">
        <div className="text-center">
          {rating} <MdRateReview/>
        </div>
        <div className="text-center text-info">
          {daysBook === 'Any Day (tick to choose date)'
            ? '$' + price
            : 'Total: $' + (parseInt(daysBook, 10) * parseFloat(price)).toFixed(0)

          }
        </div>

      </div>
    </div>
  )
}
ListingItem.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  rating: PropTypes.number,
  price: PropTypes.string,
  address: PropTypes.string,
  bedRoomNum: PropTypes.number,
  toiletNum: PropTypes.number,
  daysBook: PropTypes.string
}

export default ListingItem;
