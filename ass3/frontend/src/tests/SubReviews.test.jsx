import { shallow } from 'enzyme';
import React from 'react';
import SubReviews from '../components/SubReviews'
import { sampleListing } from './testData'
import { Modal } from 'react-bootstrap'
import { RatingView } from 'react-simple-star-rating'
describe('SubReviews', () => {
  it('Check that the empty reviews loaded will have no review', () => {
    const foo = jest.fn();
    const wrapper = shallow(<SubReviews reviewArr={ [] } setShow={foo}/>);
    expect(wrapper.find(Modal.Title).text()).toBe('No reviews');
    expect(wrapper.find(Modal.Body).children().length).toBe(0);
  })
  it('Check that the multiple reviews loaded', () => {
    const foo = jest.fn();
    const wrapper = shallow(<SubReviews reviewArr={ sampleListing.reviews } setShow={foo}/>);
    expect(wrapper.find(Modal.Title).text()).toBe('Reviews for ' + sampleListing.reviews[0].rating + ' stars');
    expect(wrapper.find(Modal.Body).children().length).toBe(2);
    for (let i = 0; i < wrapper.find(Modal.Body).children().length; i++) {
      expect(wrapper.find(Modal.Body).childAt(i).find(RatingView).props().ratingValue).toBe(sampleListing.reviews[i].rating)
      expect(wrapper.find(Modal.Body).childAt(i).find('.blockquote').first().childAt(0).text()).toBe(sampleListing.reviews[i].content)
      expect(wrapper.find(Modal.Body).childAt(i).find('.blockquote-footer').text()).toBe(sampleListing.reviews[i].email)
    }
  })
  it('will set show to be called if close btn clicked', () => {
    const foo = jest.fn();
    const wrapper = shallow(<SubReviews reviewArr={[]} setShow={foo} />);
    wrapper.find('Button').simulate('click');
    expect(foo).toBeCalledTimes(1);
  })
})
