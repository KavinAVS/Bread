import './RS.css';
import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavHeader from '../components/NavHeader.js';
import { signUp } from '../firebase';
import { Redirect } from "react-router-dom";

export default class register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error:'',
      redirect: null
    };
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleRegister(e){
    e.preventDefault();
    var user = e.target.elements.username.value;
    var email = e.target.elements.email.value;
    var password = e.target.elements.passwd.value;
    var confirmpassword = e.target.elements.confirmpasswd.value;
     
    signUp(user, email, password, confirmpassword).then((result) => { 
      if(result.code == 'ok'){
        var t = { redirect : '/profile/'+result.uid };
      }else{
        var t = { error : result.msg };
      }
      this.setState(t);
    });

    e.target.elements.passwd.value = '';
    e.target.elements.confirmpasswd.value = '';
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return(
      <div className="RS">
        <NavHeader id="nav" />
        <header className="RS-header">
          <br />
          <h1>Register</h1>
          <Form onSubmit={this.handleRegister} method="post">          
            <Form.Group controlId="formGridUserName">
              <Form.Label>Username</Form.Label>
              <Form.Control placeholder="Enter Username" name='username' required/>
            </Form.Group>

            <Form.Group controlId="formGridEmail">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email" placeholder="Enter E-mail" name='email' required/>
            </Form.Group>

            <Form.Group controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter Password" name='passwd' minLength="8" required/>
            </Form.Group>

            <Form.Group controlId="formGridConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm Password" name='confirmpasswd' minLength="8" required/>
            </Form.Group>
            <p id="error">{this.state.error}</p>
            <Form.Row className='rbtns'>
              <Button 
                className='rbtn' 
                block
                type='submit'
              >
                Register
              </Button>
              <br/>
              <a href="/signin">Sign in</a>
            </Form.Row>
          </Form>
        </header>
      </div>
    );
  }
}
