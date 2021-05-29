import React, { Component } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import NavHeader from '../components/NavHeader.js';
import PostList from '../components/PostList.js';
import HomeProfile from '../components/HomeProfile.js';
import { Auth } from '../context';
import { Redirect } from 'react-router-dom';
import { getTrendingPost } from '../firebase';
import "./pages.css";


export default class home extends Component {

  static contextType = Auth;
  state = {};

  constructor(props) {
    super(props);
  }

  // componentDidUpdate(){
  //   this.update();
  // }

  componentDidMount(){
    this.update();
  }

  update(){
    var data = {}
    getTrendingPost().then((result) => {
      if(result.code == 'ok') {
        data = result.data;
      } else {
        console.log(result.msg);
      }
    }).then(() => {
      this.setState({trending: data});
      console.log(this.state.trending);
    })    
  }
   
  render() {

    let {isLoggedIn, uid} = this.context;
    var head;
    if(isLoggedIn){
      head = <Col xs={4}>
                <HomeProfile uid={uid} />   
              </Col>
    }

    getTrendingPost()
    return (
      <>
        <NavHeader />
        <div className="page-div">
          <Container id="container-sm ctnr">
            <Row>
              {head}
              <Col>
                <ListGroup variant="flush">
                  <PostList showUser={true} showComment={true} pids={this.state.trending}/>
                </ListGroup> 
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}