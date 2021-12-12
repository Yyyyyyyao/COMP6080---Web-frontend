import { shallow } from 'enzyme';
import React from 'react';
import ListingItem from '../components/ListingItem';
import { sampleListing } from './testData'
describe('ListingItem', () => {
  it('Check ListingItem thumbnail as img passed in', () => {
    const wrapper = shallow(<ListingItem thumbnail={sampleListing.thumbnail}/>);
    expect(wrapper.find('.ListingItem-img').props().src).toBe(sampleListing.thumbnail)
  })
  it('Check ListingItem thumbnail as youtube video link passed in', () => {
    const vurl = 'https://www.youtube.com/watch?v=Sn3F8zhECeg';
    const wrapper = shallow(<ListingItem thumbnail={vurl}/>);
    expect(wrapper.find('.ListingItem-video').props().url).toBe(vurl);
  })

  it('Check ListingItem title passed in', () => {
    const wrapper = shallow(<ListingItem thumbnail={sampleListing.thumbnail} title={sampleListing.title}/>);
    expect(wrapper.find('.ListingItem-h2').text()).toBe(sampleListing.title)
  })
  it('check ListingItem rating passed in', () => {
    const wrapper = shallow(<ListingItem thumbnail={sampleListing.thumbnail} rating={5}/>);
    expect(wrapper.find('.text-center').first().text().split(' ')[0]).toBe('5')
  })
  it('check ListingItem price passed in without date filter', () => {
    const wrapper = shallow(<ListingItem thumbnail={sampleListing.thumbnail} price={'99'} daysBook={'Any Day (tick to choose date)' }/>);
    expect(wrapper.find('.text-center').last().text()).toBe('$99')
  })
  it('check ListingItem price passed in with date filter', () => {
    const wrapper = shallow(<ListingItem thumbnail={sampleListing.thumbnail} price={'99'} daysBook={'10'}/>);
    expect(wrapper.find('.text-center').last().text()).toBe('Total: $990')
  })
  it('check ListingItem address passed', () => {
    const wrapper = shallow(<ListingItem thumbnail={sampleListing.thumbnail} address={sampleListing.address} />);
    expect(wrapper.find('.ListingItem-p').text().split('  ')[1]).toBe(sampleListing.address)
  })
  it('check ListingItem bedRoomNum passed in ', () => {
    const wrapper = shallow(<ListingItem thumbnail={sampleListing.thumbnail} bedRoomNum={4} />);
    expect(wrapper.find('.ms-1').first().text().split('>')[1]).toBe('4');
  })
  it('check ListingItem toiletNum passed in ', () => {
    const wrapper = shallow(<ListingItem thumbnail={sampleListing.thumbnail} toiletNum={3} />);
    expect(wrapper.find('.ms-1').last().text().split('>')[1]).toBe('3');
  })
})
