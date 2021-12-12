import React from 'react'
import { Button, Modal, Card } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { RatingView } from 'react-simple-star-rating';
function SubReviews ({ reviewArr, setShow }) {
  return (
        <>
        <Modal show={true} >
          <Modal.Header>
                  {reviewArr.length
                    ? <Modal.Title>Reviews for {reviewArr[0].rating} {reviewArr[0].rating === 1 ? 'star' : 'stars'}</Modal.Title>
                    : <Modal.Title>No reviews</Modal.Title>}
          </Modal.Header>

              <Modal.Body className="overflow-auto">
                  {reviewArr.map((val, idx) => {
                    return <Card className="mb-3" key={ idx}>
                        <Card.Header><RatingView ratingValue={val.rating}/></Card.Header>
                      <Card.Body>
                        <blockquote className="blockquote mb-0">
                          <p>
                                    {val.content}
                          </p>
                          <footer className="blockquote-footer text-end">
                                    { val.email}
                          </footer>
                        </blockquote>
                      </Card.Body>
                    </Card>
                  })}

              </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false) }>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  )
}
SubReviews.propTypes = {
  reviewArr: PropTypes.array,
  setShow: PropTypes.func
}
export default SubReviews
