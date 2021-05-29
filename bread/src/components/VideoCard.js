import React, {Component} from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPlayer from 'react-player';
import './PostCard.css';

export default class PostCard extends Component {
  static defaultProps = {
    showUser: true, 
    showComment: true,
    src: '/images/nopic.jpg',
    dp: '/images/nodp.png',
    key:'1'
  };

  constructor(props) {
    super(props);
    this.showHeader();
    this.showComment();
  }

  showHeader(){
    if(this.props.showUser){
      this.header = 
        <Row className="pt-1">
          <Col className="mt-auto mb-auto">
            <Image
              roundedCircle
              fluid
              src={this.props.dp}
              width="35"
              className="d-inline-flex ppic"
              alt="dp"
            />
            <span className="ml-2 h6 username">Username</span>
          </Col>
        </Row>;
    }
  }

  showComment(){
    if(this.props.showComment){
      this.comments = 
          <Row>
            <Col>
              <p className="d-inline-flex mt-2 mb-2" >Comments...</p>
            </Col>
          </Row>;
    }
  }

  render() {
    return(
      <>
        <Container id="container">
          {this.header}
          <hr className="mt-1 mb-1"/>
          {/* Image*/ }
          <Row >
            <Col className="pr-1 pl-1">
            <ReactPlayer
                playsinline={true}
                url= {this.props.src}
                width="100%"
                height="640px"
                alt="No Video" 
            />
            </Col>
          </Row>
          {/* Like button*/ }
          {this.comments}
        </Container>
      </>
    );
  }
}