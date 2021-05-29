import React, {Component} from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ReactPlayer from 'react-player';
import { getPostdata } from "../firebase";
import { getUserdata } from "../firebase";
import './PostCard.css';

export default class PostCard extends Component {
  static defaultProps = {
    showUser: true, 
    showComment: true,
    showLike: true,
    src: '/images/nopic.jpg',
    dp: '/images/nodp.png',
    key:'1'
  };

  componentDidMount(){
    this.getData();
  }
  
  constructor(props) {
    super(props);
    this.state = {url: this.props.src};
    this.getData = this.getData.bind(this);
  }


  getData() {
    var data = {};
    getPostdata(this.props.pid).then((result) => {
      if(result.code == 'ok') {
        data = result.data;
        getUserdata(data.uid, 'username').then((result) => {
          if(result.code == 'ok'){
            data.username = result.data;
          }else{
            this.setState({username:"Error: User not found"});
          }
        }).then(() => {
          this.setState(data);
        })
      } else {
        console.log(result.msg);
      }
    })
  }


  render() {

    if(this.props.showLike){
      this.like = <Button variant="outline-primary" className="nvh-btn mr-0 nvh-reg mt-2 mb-2">Like</Button>;
    }

    if(this.props.showUser){
      this.header = 
        <Row className="pt-1">
          <Col className="mt-auto mb-auto">
            <a href={"/profile/"+this.state.uid} style={{"textDecoration": "none", "color": "black"}}>
              <Image
                roundedCircle
                fluid
                src={this.props.dp}
                width="35"
                className="d-inline-flex ppic"
                alt="dp"
              />
              <span className="ml-2 h6 username">{this.state.username}</span>
            </a>
          </Col>
        </Row>;
    }

    if(this.props.showComment){
      this.comments = 
          <Row>
            <Col>
              <p className="d-inline-flex mt-2 mb-2" >Comments...</p>
            </Col>
          </Row>;
    }

    return(
      <>
        <Container id="container">
          {this.header}
          <hr className="mt-1 mb-1"/>
          {/* Image*/ }
          <Row >
            <Col className="pr-1 pl-1">
            <Image
              src= {this.state.url}
              width="100%"
              className="d-flex"
              alt="No Picture"
            />
            </Col>
          </Row>
          
          {this.like}
          {this.comments}
        </Container>
      </>
    );
  }
}