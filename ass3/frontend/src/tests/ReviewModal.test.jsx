import { shallow } from 'enzyme';
import React from 'react';
import ReviewModal from '../components/ReviewModal';
import { Rating } from 'react-simple-star-rating'
describe('ReviewModal', () => {
  it('initial state has 0 rating', () => {
    const wrapper = shallow(<ReviewModal />)
    expect(wrapper.find(Rating).props().ratingValue).toBe(0);
  })
  it('initial state has no error msg', () => {
    const wrapper = shallow(<ReviewModal />)
    expect(wrapper.find('.SearchPar-err-msg').exists()).toBe(false);
  })
  it('click close btn will cause setShowReviewModal called once', () => {
    const foo = jest.fn();
    const wrapper = shallow(<ReviewModal setShowReviewModal={foo} />)
    wrapper.find('Button').first().simulate('click');
    expect(foo).toBeCalledTimes(1);
  })
})
