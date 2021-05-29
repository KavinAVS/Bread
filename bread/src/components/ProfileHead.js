import React, {Component} from 'react';
import Media from 'react-bootstrap/Media';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Auth } from '../context';
import { getUserdata, isFollowing, unfollow, follow } from "../firebase";
import { FaCheck } from 'react-icons/fa';
import './ProfileHead.css';

export default class ProfileHead extends Component {

  static contextType = Auth;
  static defaultProps = {
    dp: '/images/nodp.png',
  }
  constructor(props) {
    super(props);
    this.state = {
      buttonText:"Follow",
      username:"Loading...",
      followers: 0,
      following: 0,
      points: 0,
      verified: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.update = this.update.bind(this);
    this.checkFollowing = this.checkFollowing.bind(this);
    this.got =false;
    this.checkedFollowing = false;
  }

  componentDidUpdate(){
    this.update();
  }

  componentDidMount(){
    this.update();
  }

  update(){
    if(this.props.uid !== undefined && !this.got){
      var data = {}
      getUserdata(this.props.uid, 'username').then((result) => {
        if(result.code == 'ok'){
          data.username = result.data;
        }else{
          this.setState({username:"Error: User not found"});
          console.log(result.msg);
        }
      }).then(
      getUserdata(this.props.uid, 'num_followers').then((result) => { 
        if(result.code == 'ok'){
          data.followers = result.data;
        }else{
          console.log(result.msg);
        }
      })).then(
      getUserdata(this.props.uid, 'num_following').then((result) => { 
        if(result.code == 'ok'){
          data.following = result.data;
        }else{
          console.log(result.msg);
        }
      })).then(
        getUserdata(this.props.uid, 'points').then((result) => {
          if(result.code == 'ok') {
              data.points = result.data;
          } else {
              console.log(result.msg);
          }
      })).then(
      getUserdata(this.props.uid, 'verified').then((result) => {
        if(result.code == 'ok') {
            data.verified = result.data;
        } else {
            console.log(result.msg);
        }
      })).then(() => {
        this.got = true;
        this.setState(data);
      })
    }
    this.checkFollowing();
  }

  checkFollowing(){
    let {isLoggedIn, uid} = this.context;
    if(uid !== undefined && this.props.uid !== uid && this.props.uid !== undefined && !this.checkedFollowing){
      isFollowing(uid, this.props.uid).then((result) => {
        if(result){
          this.setState({buttonText: "Following"});
        }
        else{
          this.setState({buttonText: "Follow"});
        }
        this.checkedFollowing = true;
      });
    }
  }

  handleClick(e){
    e.preventDefault();
    if(this.state.buttonText == "Following"){
      unfollow(this.props.uid).then(() => {
        this.checkedFollowing = false;
        this.got = false;
        this.setState({buttonText: "Follow"});
      });
    }else{
      follow(this.props.uid).then(() => {
        this.checkedFollowing = false;
        this.got = false;
        this.setState({buttonText: "Following"});
      });
    }
  }

  render() {
    let {isLoggedIn, uid} = this.context;

    var followButton;
    if(this.props.uid !== uid){
      followButton = <Button block id="btn" onClick={this.handleClick}>
                        {this.state.buttonText}
                      </Button>;
    }

    var verf;
    if(this.state.verified){
      verf = <FaCheck className="hp-verified" aria-hidden={this.state.verified} />; 
    }

    return(
      <Media className="pt-5 pb-4 mr-0 mp-0 container">
        <Image
          roundedCircle
          fluid
          src={this.props.dp}
          className="ppic"
          alt="Logo"
        />
        <Media.Body className="ml-md-5">
          <div className="hp-username">
            <h5 className="ml-4 mr-1"> {this.state.username} </h5>
            {verf}
          </div>
          <Container className="pt-3 pb-3 ml-0">
            <Row className="text-center">
              <Col xs={3} className="mr-3">
                <p className=" h6 stats">Followers</p>
              </Col>
              <Col xs={3} className="mr-3">
                <p className="h6 stats">Following</p>
              </Col>
              <Col xs={3}>
                <p className="h6 stats">Points</p>
              </Col>
            </Row>
            <Row className="text-center">
              <Col xs={3} className="mr-3">
                <p className="h6 stats">{this.state.followers}</p>
              </Col>
              <Col xs={3} className="mr-3">
                <p className="h6 stats">{this.state.following}</p>
              </Col>
              <Col xs={3}>
                <p className="h6 stats">{this.state.points}</p>
              </Col>
            </Row>
            <Row className="text-center">
              <Col xs={9} className="ml-3">
                {followButton}
              </Col>
            </Row>
          </Container>
        </Media.Body>
      </Media>

    );
  }
}