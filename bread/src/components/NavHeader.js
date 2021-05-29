import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { Auth } from "../context";
import { signOut } from '../firebase';
import { Redirect } from "react-router-dom";
import UserSearchModal from './UserSearchModal';
import './NavHeader.css';

export default class NavHeader extends Component {

  static defaultProps = {
    icon:'/images/icon.png',
    dp: '/images/nodp.png'
  }

  constructor(props) {
    super(props);
    this.state = {
      error:'',
      redirect: null
    };
    this.handleSignOut = this.handleSignOut.bind(this);
  }
  static contextType = Auth;

  handleSignOut(e){
    e.preventDefault();
     
    signOut().then((result) => { 
      if(result == 'ok'){
        var t = { redirect : '/signin' };
      }else{
        var t = {};
        alert(result);
      }
      this.setState(t);
    });
  }

  render() {

    if (this.state.redirect) {
      this.redirect = <Redirect to={this.state.redirect} />;
    }
    let {isLoggedIn, uid} = this.context;

    if(isLoggedIn){
      this.left = <> 
        <Nav.Link href={"/profile/"+uid} className="ml-0 mr-0 ppic">
          <Image
            roundedCircle
            width="40"
            src={this.props.dp}
            className="d-inline"
            alt="Profile"
          />
        </Nav.Link>
        <Nav.Link className="ml-0 align-top mr-0 nvh-btnlink">
            <Button variant="outline-danger" className="nvh-btn" onClick={this.handleSignOut}>Signout</Button>
        </Nav.Link>
        </>
    }else{
      this.left = <>
        <Nav.Link href="/register" className="ml-0 align-top mr-0 nvh-btnlink">
            <Button variant="outline-success" className="nvh-btn mr-0 nvh-reg">Register</Button>
        </Nav.Link>
        <Nav.Link href="/signin" className="ml-0 align-top mr-0 nvh-btnlink">
            <Button variant="outline-success" className="nvh-btn ml-0">Signin</Button>
        </Nav.Link>
      </>
    }

    return(
      <Navbar collapseOnSelect id="nav">
        {this.redirect}
        <Navbar.Brand href={"/home"} className="brand">
          <img
            src={this.props.icon}
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Brand href={"/home"} className="mr-auto brand">
          <span className="h1 brand-text">Bread</span>
        </Navbar.Brand>
        <Nav.Link className="ml-0 align-top align-right mr-0 nvh-btnlink">
          <UserSearchModal className="ml-0 align-top mr-0 nvh-btnlink nvh-searchbtn"/> 
        </Nav.Link>
        {this.left}
      </Navbar>
    );
  }
}

