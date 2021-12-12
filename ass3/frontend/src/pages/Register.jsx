import React from 'react';
import './Register.css'
import { Form, Button, Container } from 'react-bootstrap';
import { myfetch } from '../utils/helper.jsx';
import { Redirect, Link, useHistory } from 'react-router-dom';
import ErrModal from '../components/ErrModal.jsx';
import PropTypes from 'prop-types'

function Register (props) {
  const history = useHistory();
  const goto = (loc) => {
    history.push(loc);
  }

  const [hasError, setError] = React.useState(false);
  const [errorMessage, setMsg] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.rEmail.value;
    const name = form.rName.value;
    const password = form.rPassword.value;
    const cfPassword = form.rCfPassword.value;
    if (email === '') {
      setError(true);
      setMsg('Email cannot be empty');
    } if (name === '') {
      setError(true);
      setMsg('Name cannot be empty');
    } else if (password !== cfPassword) {
      setError(true);
      setMsg('Two passwords are not the same');
    } else {
      const body = {
        email: email,
        name: name,
        password: password
      };
      // setUserInfo(user);
      try {
        const js = await myfetch('POST', 'user/auth/register', null, body);
        sessionStorage.setItem('token', js.token);
        sessionStorage.setItem('email', email);
        props.setLoginStatue(true);
        // setLeave(true);
      } catch (error) {
        setError(true);
        setMsg(error);
      }
    }
  };

  if (props.loginStatus) {
    console.log(sessionStorage.getItem('token'));
    return (
      <Redirect to={{ pathname: '/' }}/>
    );
  }

  return (
    <>
    { hasError && <ErrModal errMsg={errorMessage} setShow={setError} /> }

    <Container className="pt-5 register-form">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="registerEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="rEmail"/>
          <Form.Text className="text-muted">
            Please enter your register email
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" name="rName"/>
          <Form.Text className="text-muted">
            Please enter your name
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="rPassword"/>
          <Form.Text className="text-muted">
            Please enter your passowrd
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerCfPassword">
          <Form.Label>Comfirmed Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm Password" name="rCfPassword"/>
          <Form.Text className="text-muted">
          Please confirm your passowrd again
          </Form.Text>
        </Form.Group>

        <Form.Group className="d-flex justify-content-between">

          <Button variant="outline-secondary" type="button" onClick={() => goto('/')}>
            Back
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form.Group>
        <Form.Group className="d-flex justify-content-end">
            <Link className="text-decoration-none pt-2" to="/login">Already have an account?</Link>
          </Form.Group>
      </Form>
    </Container>
    </>
  );
}

Register.propTypes = {
  loginStatus: PropTypes.bool,
  setLoginStatue: PropTypes.func,
}

export default Register;
