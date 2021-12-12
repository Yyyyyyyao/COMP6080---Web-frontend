import { shallow } from 'enzyme';
import React from 'react';
// import renderer from 'react-test-renderer';
import HostListing from '../components/HostListing';
import { sampleListing } from './testData';
import { getTotalRating, isBase64, myDateFormat } from '../utils/helper';
import { Badge } from 'react-bootstrap'

describe('HostListing Displays', () => {
  it('display listing title', () => {
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-middle-title').find('h2').text()).toBe(sampleListing.title);
  });

  it('display listing type', () => {
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-middle-title').find('small').text()).toBe(sampleListing.metadata.propertyType);
  });

  it('display listing bathroom count', () => {
    const bathroomCount = '<MdOutlineShower />' + sampleListing.metadata.bathroom
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-middle-details').childAt(1).text()).toBe(bathroomCount);
  });

  it('display listing bedroom count', () => {
    const bedroomCount = '<MdBed />' + sampleListing.metadata.bedroom.length;
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-middle-details').childAt(0).text()).toBe(bedroomCount);
  });

  it('display listing price', () => {
    const priceDisplayed = '$' + sampleListing.price + '/night';
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-container').childAt(2).text()).toBe(priceDisplayed);
  });

  it('display listing rating', () => {
    const ratingDisplayed = '<AiFillStar /> ' + getTotalRating(sampleListing.reviews);
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-last').childAt(0).childAt(0).text()).toBe(ratingDisplayed);
  });

  it('display listing review count', () => {
    const reviewCountDisplayed = '<MdRateReview /> ' + sampleListing.reviews.length;
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-last').childAt(0).childAt(1).text()).toBe(reviewCountDisplayed);
  });

  if (isBase64(sampleListing.thumbnail)) {
    it('display listing thumbnail', () => {
      const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
      expect(hostListing.find('img').props().src).toBe(sampleListing.thumbnail);
    });
  }

  it('display listing edit Button', () => {
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-last').childAt(1).childAt(0).text()).toBe('<MdModeEdit />');
  });

  it('display listing delete Button', () => {
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-last').childAt(1).childAt(1).text()).toBe('<MdDeleteForever />');
  });
});

describe('HostListing in Unpublished status', () => {
  it('displays To Publish Button when availability is NULL', () => {
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.date-form').childAt(0).find('Button').text()).toBe('To Publish');
  });
  it('displays Add Date Button when availability is NULL', () => {
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.date-form').childAt(1).childAt(0).text()).toBe('Add Dates');
  });
  it('displays Clear Button when availability is NULL', () => {
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={sampleListing.availability} published={sampleListing.published} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.date-form').childAt(1).childAt(1).text()).toBe('Clear');
  });
});

describe('HostListing in published status', () => {
  const availability = [
    {
      start: '2021-11-01T13:00:00.000Z',
      end: '2021-11-04T13:00:00.000Z'
    },
    {
      start: '2021-11-22T13:00:00.000Z',
      end: '2021-11-24T13:00:00.000Z'
    }
  ];
  it('displays To UnPublish Button when availability is not NUll', () => {
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={availability} published={true} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    expect(hostListing.find('.Listing-publish-info').find('Button').text()).toBe('To Unpublish');
  });

  it('displays Date Range Badges when availability is not NUll', () => {
    const hostListing = shallow(<HostListing key={0} listingId={'1'} idx={0} availability={availability} published={true} title={sampleListing.title} address={sampleListing.address} price={sampleListing.price} thumbnail={sampleListing.thumbnail} metadata={sampleListing.metadata} reviews={sampleListing.reviews}></HostListing>);
    const dateBadges = hostListing.find('.Listing-publish-info').childAt(1);
    expect(dateBadges.contains(<small key={0}> <Badge bg="primary">{myDateFormat(availability[0].start)} to {myDateFormat(availability[0].end)}</Badge></small>));
    expect(dateBadges.contains(<small key={1}> <Badge bg="primary">{myDateFormat(availability[1].start)} to {myDateFormat(availability[1].end)}</Badge></small>));
  });
});
