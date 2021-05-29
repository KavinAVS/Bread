import './RS.css';
import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavHeader from '../components/NavHeader.js';
import { signIn } from '../firebase';
import { Redirect } from "react-router-dom";

export default class signin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error:'',
      redirect: null
    };
    this.handleSignin = this.handleSignin.bind(this);
  }

  handleSignin(e){
    e.preventDefault();
    var email = e.target.elements.email.value;
    var password = e.target.elements.passwd.value;

    var result = signIn(email, password);
    
    signIn(email, password).then((result) => { 
      if(result.code == 'ok'){
        var t = { redirect : '/profile/'+result.uid };
      }else{
        var t = { error : result.msg };
      }
      this.setState(t);
    });

    e.target.elements.passwd.value = '';
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <div className="RS">
        <NavHeader id="nav" />
        <header className="RS-header">
          <br />
          <h1>Login</h1>
          <Form onSubmit={this.handleSignin} method="post">
              <Form.Group controlId="formGridEmail">
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" placeholder="Enter E-mail" name='email' required/>
              </Form.Group>

              <Form.Group controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" name='passwd' required/>
              </Form.Group>
              <p id="error">{this.state.error}</p>
              <Form.Row className='rbtns'>
                <Button className='rbtn' type='submit' block>Sign in</Button>
                <br />
                <a href="/register">Register</a>
                <a>Forget Password</a>
              </Form.Row>
          </Form>
        </header>
      </div>
    );
  }
}