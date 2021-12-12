import React from 'react'
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import './MyImg.css';
import { MdDeleteForever } from 'react-icons/md';
function MyImg (props) {
  // function to delete an uploaded image
  const handleDelete = () => {
    const oldPropertyImgs = [...props.propertyImgs];
    oldPropertyImgs.splice(props.idx, 1);
    props.setPropertyImgs(oldPropertyImgs);
  }

  return (
    <Card style={{ width: '12rem' }}>
      <div className="d-flex justify-content-center">
        <Card.Img variant="top" src={props.src} className="card-img"/>
      </div>
      <Card.Body className="d-flex justify-content-center">
        <Button variant="outline-danger" onClick={handleDelete}><MdDeleteForever></MdDeleteForever></Button>
      </Card.Body>
    </Card>
  )
}

MyImg.propTypes = {
  idx: PropTypes.number,
  src: PropTypes.string,
  setPropertyImgs: PropTypes.func,
  propertyImgs: PropTypes.array,
}

export default MyImg
