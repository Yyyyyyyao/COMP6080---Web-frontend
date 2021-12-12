import React from 'react'
import { Form, Button, ButtonGroup, Badge } from 'react-bootstrap'
import PropTypes from 'prop-types';
import ErrModal from './ErrModal';
import './Bedroom.css'

function Bedroom (props) {
  // Error pop initiate
  const [showErr, setshowErr] = React.useState(false);
  const [errText, setErrMsg] = React.useState('');

  // function to delete a bedroom
  // trigger when click the delete button
  const deleteBedroom = () => {
    if (props.bedrooms.length > 1) {
      const oldBedrooms = [...props.bedrooms];
      oldBedrooms.splice(props.idx, 1);
      props.setBedrooms(oldBedrooms);
    } else {
      console.log('no more delete');
      setshowErr(true);
      setErrMsg('no more delete');
    }
  };

  // function to set bed type
  // trigger when select changes
  const setBedtype = (event) => {
    const oldBedrooms = [...props.bedrooms];
    oldBedrooms[props.idx].bedtype = event.target.value;
    props.setBedrooms(oldBedrooms);
  }

  // function to add 1 to the bed counter
  const addBed = () => {
    const oldBedrooms = [...props.bedrooms];
    oldBedrooms[props.idx].count += 1;
    props.setBedrooms(oldBedrooms);
  }

  // function to delete 1 from the bed counter
  // But bed counter cannot be less than 1
  const deleteBed = () => {
    const oldBedrooms = [...props.bedrooms];
    if (oldBedrooms[props.idx].count >= 2) {
      oldBedrooms[props.idx].count -= 1;
      props.setBedrooms(oldBedrooms);
    } else {
      setshowErr(true);
      setErrMsg('No more delete on beds');
    }
  }

  return (
    <>
    {showErr && <ErrModal setShow={setshowErr} errMsg={errText} />}
    <div className="mt-2 Bedroom-card">
      <h5>Bedroom {props.idx + 1} </h5>
      <div className="bed-custom-block">
        <div>
          <Form.Label>Bed Type</Form.Label>
        </div>
        <div>
          <Form.Select value={props.bedroom.bedtype} onChange={(event) => { setBedtype(event) }} >
            <option value="Single Bed">Single Bed</option>
            <option value="Queen Bed">Queen Bed</option>
            <option value="King Bed">King Bed</option>
          </Form.Select>
        </div>
        <div>
        <ButtonGroup className="mb-2">
          <Button variant="outline-primary" size="sm" onClick={deleteBed}>-</Button>
          <Badge bg="light" text="dark" className="d-flex align-items-center">{props.bedroom.count}</Badge>
          <Button variant="outline-primary" size="sm" onClick={addBed}>+</Button>
        </ButtonGroup>
        </div>
      </div>
      <div>
        <Button variant="outline-danger" size="sm" onClick={deleteBedroom}>Delete</Button>
      </div>
      <hr/>
    </div>
    </>
  )
}

Bedroom.propTypes = {
  idx: PropTypes.number,
  bedroom: PropTypes.object,
  setBedrooms: PropTypes.func,
  bedrooms: PropTypes.array
}

export default Bedroom
