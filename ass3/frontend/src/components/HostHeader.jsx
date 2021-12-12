import React from 'react';
import './HostHeader.css';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function HostHeader () {
  const history = useHistory();
  return (
    <>
      <div className="d-flex justify-content-center pt-3">
        <Button name="createListingBtn" className="outline-primary" onClick={() => { history.push('/createListing') }}> Add new listing</Button>
      </div>
      <hr />
    </>
  );
}
export default HostHeader;
