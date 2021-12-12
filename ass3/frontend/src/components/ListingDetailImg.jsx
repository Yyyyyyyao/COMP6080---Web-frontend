import React from 'react';
import { Carousel } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import './ListingDetailImg.css';
import { isBase64 } from '../utils/helper';
import ReactPlayer from 'react-player'
const ListingDetailImg = ({ thumbnail, hasImgs, imgArray }) => {
  return (
    <Carousel fade className="ListingDetail-img mb-3">
      <Carousel.Item className="ListingDetail-imgItem">
        {isBase64(thumbnail)
          ? <img
          className="d-block img-fluid"
          src={thumbnail}
          alt="house thumbnail"
          />
          : <ReactPlayer url={thumbnail} width={'100%'}/>}

      </Carousel.Item>
      {hasImgs &&
        imgArray.map((val, idx) => {
          return (
            <Carousel.Item key={idx} className="ListingDetail-imgItem">
              <img
                className="d-block img-fluid"
                src={val}
                alt="house image"
              />
            </Carousel.Item>
          );
        })}
    </Carousel>
  );
};
ListingDetailImg.propTypes = {
  thumbnail: PropTypes.string,
  hasImgs: PropTypes.bool,
  imgArray: PropTypes.array
};
export default ListingDetailImg;
