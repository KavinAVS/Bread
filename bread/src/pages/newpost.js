import React, { Component } from 'react';
import NavHeader from '../components/NavHeader.js';
import PostCard from '../components/PostCard.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { Redirect } from 'react-router-dom';
import { uploadImage } from '../firebase';

import "./pages.css";

export default class newpost extends Component {

  constructor(props){
    super(props);
    this.tags = [];
    this.state = {
      file: '/images/nopic.jpg',
      tagsElements: [],
      currentTag: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.makeTags();
  }

  handlePost(event) {
    if(this.state.file_ob){
      console.log(this.state.file_ob);
      uploadImage(this.state.file_ob).then((result) => { 
        if(result.code == 'ok'){
          var t = { redirect : '/'};
        }else{
          var t = { error : result.msg };
        }
        this.setState(t);
      });
    }
  }

  handleChange(event) {
    if(event.target.files[0]){
      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
        file_ob: event.target.files[0]
      });
    }
  }

  makeTags() {
    var t = [];
    for (var i = 0; i < this.tags.length; i++) {
      t.push(
        <Badge className="mr-1" key={i} variant="secondary">{this.tags[i]}</Badge>
      );
    }
    this.setState({ tagsElements : t});
  }

  handleAddTag(event) {
    event.preventDefault();
    var val = event.target.elements.tag.value;
    if(val.length != ''){
      this.tags.push(val);
      this.makeTags();
      event.target.elements.tag.value = '';
    }
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <>
        <NavHeader id="nav" />
        <div className="page-div">
          <Container className="container-sm" fluid id="main-body">
            <Row>
              <Col>
                <Form>
                  <Form.Group controlId="image">
                    <Form.Label>
                    <Image
                      id="preview"
                      fluid
                      src={this.state.file}
                      width="100%"
                      className="d-flex"
                      alt="upload image"
                    />
                    </Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Upload an image</Form.Label><br/>
                    <input type="file" onChange={this.handleChange}/>
                  </Form.Group>
                  <Form.Group controlId="description">
                    <Form.Label>Add a description...</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  <Form.Group controlId="tags">
                  </Form.Group>
                </Form>
                  <Form onSubmit={this.handleAddTag}>
                    <Form.Label>Add tags...</Form.Label>
                    <div className="mb-2">{this.state.tagsElements}</div>
                    <Form.Control type="text" name='tag'/>
                    <Button type="submit">Add Tag</Button>
                  </Form>
              </Col>
              <Col>
                <PostCard
                  showUser={true} 
                  showComment={true}
                  src={this.state.file}  
                />
                <Button type="submit" style={{float:"right"}} onClick={this.handlePost}>Post</Button>
                <p id="error">{this.state.error}</p>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}