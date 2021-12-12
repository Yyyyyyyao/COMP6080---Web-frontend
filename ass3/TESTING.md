**CAUTION:**
Our UI testing needs to be run upon empty database
Because cypress will alter the contents 
and looking for real data in the database


**GUIDE:** 
1. Enter ./backend and Run `yarn reset` to reset datebase
2. Enter ./frontend and Run `yarn test`
    This will run all components and ui tests

PS:  Remember to open API and React App 


**Component tests:**
See in `./frontend/src/tests folder`



**UI tests:**

See in `./frontend/cypress/integration/ui-tests-happy-path`

customPath:
1. admin successfully register
2. create a list
3. publish a list
4. log out and Successfully signs up customer
5. Make a booking successfully
6. Logout customer
7. admin login and accept booking
8. log out admin
9. login customer 
10. customer Review successfully
11. log out customer

This is a path for customer to make a review. But we need firstly create a listing from another user. After the customer make a booking. Another user needs to accept it. So that the customer can make a review.

happyPath:
1. Registers successfully
2. Creates a new listing successfully
3. Updates the thumbnail and title of the listing successfully
4. Publish a listing successfully
5. Unpublish a listing successfully
6. Make a booking successfully
7. Logs out of the application successfully
8. Logs back into the application successfully

This path has to be run after custom Path because it is going to use the pre-create listing in the custom Path
