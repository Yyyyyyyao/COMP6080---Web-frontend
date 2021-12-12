import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types';
function DeleteModal (props) {
  return (
        <>
        <Modal show={true} >
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
              <Modal.Body> Are you sure you want to delete?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => props.setShow(false) }>
              Close
            </Button>
            <Button variant="danger" onClick={() => { props.handler(); props.setShow(false); } }>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  )
}
DeleteModal.propTypes = {
  setShow: PropTypes.func,
  handler: PropTypes.func,
}
export default DeleteModal
