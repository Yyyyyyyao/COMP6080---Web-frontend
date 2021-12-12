/// <reference types="cypress" />
import 'cypress-file-upload';

context('happy path', () => {
  const email = 'd@d.com';
  const name = 'd';
  const password = 'd';
  const confirmedPassword = 'd';
  const thumbNail = 'cat.jpeg';
  const propertyTitle = 'House Catty';
  const propertyAddress = '2 Catty Road';
  const propertyPrice = '800';

  it('Sign up', () => {
    cy.visit('localhost:3000/register');
    cy.get('input[name=rEmail]')
      .focus()
      .type(email);

    cy.get('input[name=rName]')
      .focus()
      .type(name);

    cy.get('input[name=rPassword]')
      .focus()
      .type(password);

    cy.get('input[name=rCfPassword]')
      .focus()
      .type(confirmedPassword);

    cy.get('button[type=submit]')
      .click();
  });

  it('Create listing', () => {
    cy.get('a[name=myHosting]')
      .click();

    // create listing
    cy.get('button[name=createListingBtn]')
      .click();

    cy.get('input[name=thumbNailImgUpload]')
      .attachFile(thumbNail);

    cy.get('input[name=PropertyTitle]')
      .type(propertyTitle);

    cy.get('input[name=PropertyAddress]')
      .type(propertyAddress);

    cy.get('input[name=PropertyPrice]')
      .type(propertyPrice);

    cy.get('select[name=PropertyType]')
      .select('house');

    cy.get('button[name=addBathBtn]')
      .click();

    cy.get('input[name=gym]')
      .check();

    cy.get('input[name=parking]')
      .check();

    cy.get('button[name=normalSubmit]')
      .click();
  });
  it('Publish', () => {
    // publish
    cy.get('button[name=addDatePicker]')
      .click();

    cy.get('button[name=publishBtn]')
      .click();
  });
  it('Unpublish', () => {
    // unpublish
    cy.get('button[name=unpublishBtn]')
      .click();
  });

  it('Make a booking', () => {
    // make a booking
    cy.get('a[name=home]')
      .click();

    cy.get('div[class=ListingItem-card]')
      .first()
      .click();

    cy.get('button[name=bookNowBtn]')
      .click();

    cy.get('button[name=calenderbookingBtn]')
      .click();
  });

  it('Logout', () => {
    cy.get('a[id=basic-nav-dropdown]')
      .click()
    cy.get('a[name=navbar-logout-btn]')
      .click()
  });

  it('Login', () => {
    cy.get('a[id=basic-nav-dropdown]')
      .click()

    cy.get('a[name=navbar-login-btn]')
      .click()

    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=pwd]')
      .focus()
      .type(password);

    cy.get('button[type=submit]')
      .click();
  });
})
