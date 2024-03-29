import React from 'react'
import { Form, Button, ButtonGroup, Badge, Image } from 'react-bootstrap'
import { MdOutlineShower } from 'react-icons/md';
import { RiImageAddLine } from 'react-icons/ri';
import Bedroom from '../components/Bedroom';
import ErrModal from '../components/ErrModal';
import { useParams, useHistory } from 'react-router-dom';
import { myfetch, fileToDataUrl, isBase64 } from '../utils/helper';
import MyImg from '../components/MyImg';
import './EditListing.css';
import ReactPlayer from 'react-player';

function EditListing () {
  const history = useHistory();
  const [showErr, setshowErr] = React.useState(false);
  const [errText, setErrMsg] = React.useState('');
  const [listing, setListing] = React.useState({});
  const [thumbnail, setThumbnail] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [bathCount, setBath] = React.useState(0);
  const [bedrooms, setBedrooms] = React.useState([
    { bedtype: '', count: 1 }
  ]);
  const [amenities, setAmenity] = React.useState({
    gym: false,
    pool: false,
    bbq: false,
    parking: false
  });
  const [propertyImgs, setPropertyImgs] = React.useState([]);

  const [useVideo, setUsevideo] = React.useState(false);
  const [videoLink, setVideoLink] = React.useState('');
  const switchThumbnail = () => {
    if (useVideo === true) {
      setThumbnail('data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k=');
    }
    setUsevideo(!useVideo);
  };

  const changeVideoLink = (event) => {
    setVideoLink(event.target.value);
  }

  const imgsHandler = async (event) => {
    const imgsList = event.target.files;
    const imgUrls = [...propertyImgs];
    for (const imgFile of imgsList) {
      const p = fileToDataUrl(imgFile);
      const imgUrl = await p;
      imgUrls.push(imgUrl);
    }
    setPropertyImgs(imgUrls);
  };
  const { id } = useParams();

  const getListingInfo = async (listingId) => {
    try {
      const url = 'listings/' + listingId;
      const js = await myfetch('GET', url, null, null);
      return js.listing;
    } catch (error) {
      setshowErr(true);
      setErrMsg(error);
    }
  }

  React.useEffect(async () => {
    const p = getListingInfo(id);
    const currListing = await p;
    setListing(currListing);
  }, []);

  React.useEffect(() => {
    // to avoid inital listing is empty exception
    if (JSON.stringify(listing) !== JSON.stringify({})) {
      setThumbnail(listing.thumbnail);
      if (!isBase64(listing.thumbnail)) {
        setUsevideo(true);
        setVideoLink(listing.thumbnail);
      }
      setBath(listing.metadata.bathroom);
      setBedrooms(listing.metadata.bedroom);
      setAmenity(listing.metadata.amenities);
      setPropertyImgs(listing.metadata.propertyImgs);
      setPropertyType(listing.metadata.propertyType);
    }
  }, [listing]);

  const handleThumbNail = async (event) => {
    const file = event.target.files[0];
    const dataUrl = await fileToDataUrl(file);
    setThumbnail(dataUrl);
  }

  const addBath = () => {
    setBath(bathCount + 1);
  }

  const deleteBath = () => {
    if (bathCount >= 1) {
      setBath(bathCount - 1);
    } else {
      setshowErr(true);
      setErrMsg('No more delete on bathroom');
    }
  }

  const handleCheckbox = (event) => {
    const newAmenities = amenities;
    newAmenities[event.target.value] = event.target.checked;
    setAmenity(newAmenities);
  }

  const handlePropertyType = (event) => {
    setPropertyType(event.target.value);
  }

  // add Bedroom div
  const addBedrooms = () => {
    const newBedrooms = [...bedrooms, { bedtype: '', count: 1 }];
    setBedrooms(newBedrooms);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const listingTitle = form.editListingTitle.value;
    const listingAddress = form.editListingAddress.value;
    const listingPrice = form.editListingPrice.value;
    const listingMetadata = {
      propertyType: form.editListingPropertyTypes.value,
      bathroom: bathCount,
      bedroom: bedrooms,
      amenities: amenities,
      propertyImgs: propertyImgs,
    };
    const body = {
      metadata: listingMetadata,
      thumbnail: thumbnail,
    };
    if (useVideo) {
      body.thumbnail = videoLink;
    }
    const isnum = /^[1-9]\d*$/.test(listingPrice);
    if (listingTitle !== '' && listingTitle.trim() === '') {
      setshowErr(true);
      setErrMsg('Please enter a valid title');
    } else if (listingAddress !== '' && listingAddress.trim() === '') {
      setshowErr(true);
      setErrMsg('Please enter a valid title');
    } else if (listingPrice !== '' && !isnum) {
      setshowErr(true);
      setErrMsg('Please enter a valid price');
    } else {
      if (listingTitle !== '') {
        body.title = listingTitle;
      }
      if (listingAddress !== '') {
        body.address = listingAddress;
      }
      if (listingPrice !== '') {
        body.price = listingPrice;
      }

      try {
        const url = 'listings/' + id;
        await myfetch('PUT', url, sessionStorage.getItem('token'), body);
        history.push('/host');
      } catch (error) {
        setshowErr(true);
        setErrMsg(error);
      }
    }
  }

  return (
    <>
      {showErr && <ErrModal setShow={setshowErr} errMsg={errText} />}
      <h1 className="d-flex justify-content-center">
        Edit this Listing
      </h1>
      <div>
        <div className="d-flex justify-content-center">
          {/* <Image src={thumbnail} thumbnail width="200" height="200"/> */}
          {!useVideo && <Image src={thumbnail} thumbnail width="200" height="200"/>}
          {useVideo && <ReactPlayer url={videoLink} width="300px" height="200px"/>}
        </div>
      <div className="p-2">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label><h3>Please upload ThumbNail</h3></Form.Label>
            {/* <Form.Control type="file" onChange={handleThumbNail}/> */}
            <div>
              {!useVideo && <Button variant="outline-primary" size="sm" onClick={switchThumbnail}>Switch to YouTube Thumbnail</Button>}
              {useVideo && <Button variant="outline-primary" size="sm" onClick={switchThumbnail}>Switch to Image Thumbnail</Button>}
            </div>
            {useVideo && <Form.Control type="text" placeholder="Enter YouTube Url" onChange={changeVideoLink}/>}
            {!useVideo && <Form.Control type="file" onChange={handleThumbNail}/>}
            <Form.Text className="text-muted">
              This will be the cover of your listing 🎑
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editListingTitle">
            <Form.Label><h3>Title</h3></Form.Label>
            <Form.Control type="text" placeholder={ listing.title }/>
            <Form.Text className="text-muted">
              Greate Title can attract more people 🤩
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editListingAddress">
            <Form.Label><h3>Address</h3></Form.Label>
            <Form.Control type="text" placeholder={listing.address} />
            <Form.Text className="text-muted">
              Let customer know where it is 📍
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editListingPrice">
            <Form.Label><h3>Price Per Night</h3></Form.Label>
            <Form.Control type="text" placeholder={listing.price} />
            <Form.Text className="text-muted">
              Make a reasonable Price to achieve Win-Win 💰
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editListingPropertyTypes">
            <Form.Label><h3>Property Types</h3></Form.Label>
            <Form.Select value={propertyType} onChange={handlePropertyType}>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="cabin">Cabin</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editListingBathCounter">
            <Form.Label><h3>Number of Bathrooms</h3></Form.Label>
            <div>
            <MdOutlineShower></MdOutlineShower>
            <ButtonGroup className="mb-2">
              <Button variant="outline-primary" size="sm" onClick={deleteBath}>-</Button>
              <Badge bg="light" text="dark" className="d-flex align-items-center">{bathCount}</Badge>
              <Button variant="outline-primary" size="sm" onClick={addBath}>+</Button>
            </ButtonGroup>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editListingBedrooms">
            <Form.Label><h3>Bedrooms</h3></Form.Label>
            <div>
              <Button size="sm" variant="outline-primary" onClick={addBedrooms}>Add Bedrooms</Button>
            </div>
            {
              bedrooms.map((value, index) => (
                <Bedroom key={index} idx={index} bedroom={value} setBedrooms={setBedrooms} bedrooms={bedrooms}/>
              ))
            }

          </Form.Group>

          <Form.Group className="mb-3" controlId="editListingAmenities">
            <Form.Label><h3>Property Amenities</h3></Form.Label>
            {amenities.gym && <Form.Check label="💪 Gym" name="gym" type="checkbox" id='checkboxGym' value="gym" onChange={handleCheckbox} defaultChecked={true}/>}
            {!amenities.gym && <Form.Check label="💪 Gym" name="gym" type="checkbox" id='checkboxGym' value="gym" onChange={handleCheckbox} defaultChecked={false}/>}

            {amenities.pool && <Form.Check label="🏊‍♀️ Pool" name="pool" type="checkbox" id='checkboxPool' value="pool" onChange={handleCheckbox} defaultChecked={true}/>}
            {!amenities.pool && <Form.Check label="🏊‍♀️ Pool" name="pool" type="checkbox" id='checkboxPool' value="pool" onChange={handleCheckbox} defaultChecked={false}/>}

            {amenities.bbq && <Form.Check label="🍗 BBQ" name="bbq" type="checkbox" id='checkboxBbq' value="bbq" onChange={handleCheckbox} defaultChecked={true}/>}
            {!amenities.bbq && <Form.Check label="🍗 BBQ" name="bbq" type="checkbox" id='checkboxBbq' value="bbq" onChange={handleCheckbox} defaultChecked={false}/>}

            {amenities.parking && <Form.Check label="🅿️ Private Parking" name="parking" type="checkbox" id="checkboxParking" value="parking" onChange={handleCheckbox} defaultChecked={true}/>}
            {!amenities.parking && <Form.Check label="🅿️ Private Parking" name="parking" type="checkbox" id="checkboxParking" value="parking" onChange={handleCheckbox} defaultChecked={false}/>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="editListingAddImgs">
          <Form.Label><h3>Property Images</h3></Form.Label>
            <label className="multi-file-icon" htmlFor="formImgs"><RiImageAddLine className="icon"></RiImageAddLine></label>
            <input type="file" id="formImgs" multiple onChange={imgsHandler}/>
            <div className="d-flex flex-wrap">
              {propertyImgs.map((imgUrl, idx) => (
                <MyImg key={idx} src={imgUrl} idx={idx} setPropertyImgs={setPropertyImgs} propertyImgs={propertyImgs}></MyImg>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={() => { history.push('/host') }}>
              Back
            </Button>
            <Button variant="outline-primary" type="submit">
              Submit
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>

  </>
  )
}

export default EditListing
