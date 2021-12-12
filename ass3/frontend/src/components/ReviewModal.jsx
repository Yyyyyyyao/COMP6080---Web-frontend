import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Rating } from 'react-simple-star-rating';
import { myfetch } from '../utils/helper';

function ReviewModal ({ id, bookingid, setShowReviewModal, setJustReview }) {
  const [rating, setRating] = React.useState(0);
  const handleRating = (rate) => {
    setRating(rate);
  };
  const [validated, setValidated] = React.useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (e.target.ReviewModalReviewContent.value === '') {
      setValidated(false);
      return;
    } else {
      setValidated(true);
    }

    try {
      await myfetch(
        'put',
        `listings/${id}/review/${bookingid}`,
        sessionStorage.getItem('token'),
        {
          review: {
            email: sessionStorage.getItem('email'),
            rating: rating,
            content: e.target.ReviewModalReviewContent.value,
          },
        }
      );

      setShowReviewModal(false);
      setJustReview(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Modal show={true}>
        <Modal.Header>
          <Modal.Title>Leave a review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group
              className="mb-3 align-items-center d-flex"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Rating</Form.Label>
              <Rating
                className="mx-1"
                transition={true}
                onClick={handleRating}
                ratingValue={rating}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Review</Form.Label>
              <Form.Control
                className="ReviewModal-content"
                name="ReviewModalReviewContent"
                as="textarea"
                rows={3}
              />

              {!validated && (
                <div name="ratingError" className="SearchPar-err-msg">
                  Please do not leave empty review content.
                </div>
              )}
            </Form.Group>
            <Form.Group className="mt-3 justify-content-between d-flex">
              <Button
                variant="secondary"
                onClick={() => setShowReviewModal(false)}
              >
                Close
              </Button>
              <Button name="reviewmodal-review-btn" variant="primary" type="submit">
                Review
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
ReviewModal.propTypes = {
  id: PropTypes.string,
  bookingid: PropTypes.string,
  setShowReviewModal: PropTypes.func,
  setJustReview: PropTypes.func
};
export default ReviewModal;
