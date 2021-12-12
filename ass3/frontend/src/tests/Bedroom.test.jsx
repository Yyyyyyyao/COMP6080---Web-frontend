import { shallow } from 'enzyme';
import React from 'react';
// import renderer from 'react-test-renderer';
import Bedroom from '../components/Bedroom';

describe('Bedroom', () => {
  const noop = () => {};
  const bedrooms = [{
    bedtype: 'Single Bed', count: 1
  }];
  it('displays Bed type title', () => {
    const bedroom = shallow(<Bedroom key={0} idx={0} bedroom={bedrooms[0]} setBedrooms={noop} bedrooms={bedrooms}/>);
    expect(bedroom.find('.bed-custom-block').childAt(0).childAt(0).text()).toBe('Bed Type');
  });

  it('displays Bed type selector', () => {
    const bedroom = shallow(<Bedroom key={0} idx={0} bedroom={bedrooms[0]} setBedrooms={noop} bedrooms={bedrooms}/>);
    expect(bedroom.find('.bed-custom-block').childAt(1).childAt(0).props().value).toBe(bedrooms[0].bedtype);
  });

  it('displays Bed count', () => {
    const bedroom = shallow(<Bedroom key={0} idx={0} bedroom={bedrooms[0]} setBedrooms={noop} bedrooms={bedrooms}/>);
    expect(bedroom.find('.mb-2').find('Badge').text()).toBe(bedrooms[0].count.toString());
  });

  it('displays Bed count minus button', () => {
    const bedroom = shallow(<Bedroom key={0} idx={0} bedroom={bedrooms[0]} setBedrooms={noop} bedrooms={bedrooms}/>);
    expect(bedroom.find('.mb-2').childAt(0).text()).toBe('-');
  });

  it('displays Bed count add button', () => {
    const bedroom = shallow(<Bedroom key={0} idx={0} bedroom={bedrooms[0]} setBedrooms={noop} bedrooms={bedrooms}/>);
    expect(bedroom.find('.mb-2').childAt(2).text()).toBe('+');
  });

  it('displays Delete button', () => {
    const bedroom = shallow(<Bedroom key={0} idx={0} bedroom={bedrooms[0]} setBedrooms={noop} bedrooms={bedrooms}/>);
    expect(bedroom.find('.Bedroom-card').childAt(2).find('Button').text()).toBe('Delete');
  });
});
