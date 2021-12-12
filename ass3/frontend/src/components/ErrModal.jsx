import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types';
function ErrModal (props) {
  return (
        <>
        <Modal show={true} >
          <Modal.Header >
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>

              <Modal.Body> {

              props.errMsg}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => props.setShow(false) }>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  )
}
ErrModal.propTypes = {
  errMsg: PropTypes.string,
  setShow: PropTypes.func
}
export default ErrModal
