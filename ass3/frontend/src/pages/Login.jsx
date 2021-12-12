import React from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import './Login.css'
import { myfetch } from '../utils/helper'
import ErrModal from '../components/ErrModal'
import PropTypes from 'prop-types';
const Login = (props) => {
  const history = useHistory();

  const goBackTo = () => {
    if (history.length <= 4) {
      history.push('/')
    } else {
      history.goBack();
    }
  }
  // const [gotoHome, setGotoHome] = React.useState(false);
  const [showErr, setshowErr] = React.useState(false);
  const [errText, setErrText] = React.useState(false);
  const setLoginFormValue = async (e) => {
    e.preventDefault();
    const loginFormJs = {
      email: e.target.email.value,
      password: e.target.pwd.value
    }
    try {
      const res = await myfetch('post', 'user/auth/login', null, loginFormJs);
      sessionStorage.setItem('token', res.token);
      sessionStorage.setItem('email', e.target.email.value);
      props.setLoginStatue(true);
      goBackTo();
    } catch (err) {
      setErrText(err);
      setshowErr(true);
    }
  }

  return (
    <>
      {showErr && <ErrModal setShow={setshowErr} errMsg={errText} />}
      <Container className=" Login-container d-flex justify-content-center pt-5">
        <Form className="Login-form" onSubmit={setLoginFormValue}>
          <Form.Group className="mb-3" controlId="login-email">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email"/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="login-pwd">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="pwd" />
          </Form.Group>

          <Form.Group className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={goBackTo}>
              Back
            </Button>

            <Button name="login-page-login-btn" variant="primary" type="submit">
              Log in
            </Button>
          </Form.Group>
          <Form.Group className="d-flex justify-content-end">
            <Link className="text-decoration-none pt-2" to="/register">New User?</Link>
          </Form.Group>

        </Form>
      </Container>
    </>
  );
}
Login.propTypes = {
  setLoginStatue: PropTypes.func
}
export default Login
