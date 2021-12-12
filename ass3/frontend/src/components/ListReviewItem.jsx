import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import { RatingView } from 'react-simple-star-rating';
import PropTypes from 'prop-types';
const ListReviewItem = ({ reviews }) => {
  return (
    <Carousel
      variant="dark"
      className="ListingDetail-review mt-auto border-top "
      indicators={false}
    >
      {reviews.length !== 0
        ? (
            reviews.map((r, idx) => {
              return (
            <Carousel.Item
              key={idx}
              className="ListingDetail-reviewItem text-center"
            >
              <RatingView ratingValue={r.rating} />
              <Container className="d-flex flex-column align-items-center">
                <h5 className="mb-auto">&quot;{r.content}&quot;</h5>
                <div className="mt-auto ms-5 blockquote-footer text-right">
                  {r.email}
                </div>
              </Container>
            </Carousel.Item>
              );
            })
          )
        : (
        <Carousel.Item className="ListingDetail-reviewItem text-center">
          <Container className="d-flex justify-content-center">
            <h2 className="mt-4">No reviews</h2>
          </Container>
        </Carousel.Item>
          )}
    </Carousel>
  );
};
ListReviewItem.propTypes = {
  reviews: PropTypes.array,
};
export default ListReviewItem;
