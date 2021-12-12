/// <reference types="cypress" />
import 'cypress-file-upload';
context('Make a review - my path', () => {
  const email = 'admin@admin.com';
  const name = 'admin';
  const password = 'admin';
  const confirmedPassword = 'admin';
  const thumbNail = 'cat.jpeg';
  const propertyTitle = 'House doggy';
  const propertyAddress = '2 Doggy Road';
  const propertyPrice = '500';
  it('Successfully signs up admin', () => {
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

  it('create listing', () => {
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
  it('publish', () => {
    // publish
    cy.get('button[name=addDatePicker]')
      .click();

    cy.get('button[name=publishBtn]')
      .click();
  });
  it('Logout host ', () => {
    cy.get('a[id=basic-nav-dropdown]')
      .click()
    cy.get('a[name=navbar-logout-btn]')
      .click()
  })

  // it('Successfully Login', () => {
  //   cy.get('a[id=basic-nav-dropdown]')
  //     .click()
  //   cy.get('a[name=navbar-login-btn]')
  //     .click()
  //   const useremail = 'peng@peng.com';
  //   const userpassword = 'peng';
  //   cy.get('input[name=email]')
  //     .focus()
  //     .type(useremail);
  //   cy.get('input[name=pwd]')
  //     .focus()
  //     .type(userpassword);
  //   cy.get('button[type=submit]')
  //     .click()
  // })
  it('Successfully signs up customer', () => {
    cy.get('a[id=basic-nav-dropdown]')
      .click()
    cy.get('a[name=navbar-signup-btn]')
      .click()
    const username = 'Peng3';
    const useremail = 'peng3@peng3.com';
    const userpassword = 'peng3';
    const confirmPwd = 'peng3';

    cy.get('input[name=rName]')
      .focus()
      .type(username);
    cy.get('input[name=rEmail]')
      .focus()
      .type(useremail);
    cy.get('input[name=rPassword]')
      .focus()
      .type(userpassword);
    cy.get('input[name=rCfPassword]')
      .focus()
      .type(confirmPwd);
    cy.get('button[type=submit]')
      .click()
  })
  it('Make a booking successfully', () => {
    cy.get('div[class=ListingItem-card]')
      .first()
      .click()
    cy.get('button[name=bookNowBtn]')
      .click()
    cy.get('button[name=calenderbookingBtn]')
      .click()
  })
  it('Logout customer ', () => {
    // cy.wait(1000);
    cy.get('a[id=basic-nav-dropdown]')
      .click()
    // cy.wait(1000);
    cy.get('a[name=navbar-logout-btn]')
      .click()
  })

  it('login host and accept the booking', () => {
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
    cy.get('button[name=login-page-login-btn]')
      .click()

    cy.get('a[name=myHosting]')
      .click()
    cy.get('button[name=viewBookingBtn]')
      .click()
    cy.get('div[name=pending-req-btn]')
      .get('button')
      .first()
      .click()
    cy.get('button[name=accept-booking-btn]')
      .first()
      .click()
  })
  it('Logout host ', () => {
    // cy.wait(1000);
    cy.get('a[id=basic-nav-dropdown]')
      .click()
    // cy.wait(1000);
    cy.get('a[name=navbar-logout-btn]')
      .click()
  })

  it('login user for review', () => {
    cy.get('a[id=basic-nav-dropdown]')
      .click()
    cy.get('a[name=navbar-login-btn]')
      .click()
    const useremail = 'peng3@peng3.com';
    const userpassword = 'peng3';
    cy.get('input[name=email]')
      .focus()
      .type(useremail);
    cy.get('input[name=pwd]')
      .focus()
      .type(userpassword);
    cy.get('button[type=submit]')
      .click()
  })
  it('Review successfully', () => {
    cy.get('div[class=ListingItem-card]')
      .first()
      .click()
    cy.get('button[name=rate-it-btn]')
      .first()
      .click()
    cy.get('svg')
      .last()
      .click()
    cy.get('textarea')
      .first()
      .focus()
      .type('very very good')
    cy.get('button[name=reviewmodal-review-btn]')
      .click()
  })
  it('Logout host customer', () => {
    // cy.wait(1000);
    cy.get('a[id=basic-nav-dropdown]')
      .click()
    // cy.wait(1000);
    cy.get('a[name=navbar-logout-btn]')
      .click()
  })
})
