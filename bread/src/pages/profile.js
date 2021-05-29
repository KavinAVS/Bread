import React, {Component} from 'react';
import NavHeader from '../components/NavHeader.js';
import ProfileHead from '../components/ProfileHead.js';
import PostList from '../components/PostList.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Auth } from "../context";
import { getUserdata } from "../firebase";
import './pages.css';


export default class profile extends Component {
  
  static contextType = Auth;
  
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = {};
    this.got =false;
  }

  componentDidUpdate(){
    this.update();
  }

  componentDidMount(){
    this.update();
  }

  update(){
    let {isLoggedIn, uid} = this.context;
    var u;
    if(this.props.match.params.uid == undefined || this.props.match.params.uid == null ){
      u = uid;
    }else{
      u = this.props.match.params.uid;
    }

    if(u !== undefined && !this.got){
      var data = {}
      getUserdata(u, 'posts').then((result) => {
        if(result.code == 'ok') {
          data.posts = result.data;
        } else {
          console.log(result.msg);
        }
      }).then(() => {
        this.got = true;
        this.setState(data);
      })    
    }
  }

  render() {

    let {isLoggedIn, uid} = this.context;
    var ph;
    if(this.props.match.params.uid == undefined || this.props.match.params.uid == null ){
      ph = uid;
    }else{
      ph = this.props.match.params.uid;
    }
    return (
      <>
        <NavHeader id="nav" />
        <div className="page-div">
          <Container id="container-sm ctnr">
            <Row>
              <ProfileHead uid={ph} />  
            </Row>
            <Row>
              <PostList showComment={true} showUser={true} pids={this.state.posts} />
            </Row>
          </Container>
        </div>
      </>
    );
  }
}
