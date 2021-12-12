import React from 'react'
import { ToastContainer, Toast } from 'react-bootstrap'
import PropTypes from 'prop-types'
const ToastComp = ({ justBook, setJustBook }) => {
  return (
        <>
          <ToastContainer className='p-3 opacity-100' position='bottom-end' style={{
            top: '70vh',
          }}>
              <Toast bg="warning" onClose={() => setJustBook(false)} show={justBook} delay={3000} autohide >
                <Toast.Header closeButton={true}>
                  <strong className="me-auto">Booking Confirmed</strong>
                </Toast.Header>
                <Toast.Body >Waiting for host to accept.</Toast.Body>
              </Toast>
            </ToastContainer>

        </>
  );
}
ToastComp.propTypes = {
  justBook: PropTypes.bool,
  setJustBook: PropTypes.func
}
export default ToastComp
