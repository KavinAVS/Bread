import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import { FaSearch } from "react-icons/fa";
import { getUsers } from '../firebase';
import "./UserSearchModal.css";

export default class UserSearchModal extends Component {
  static defaultProps = {
    
  };

  constructor(props) {
    super(props);
    this.state = {
        show: false,
        users: ""
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
  }

  handleClose(){
    this.setState({show: false});
  }

  handleShow(){
    this.setState({show: true});
  }

//   routeChange(link){
//       let history = useHistory();
//       history.push(link);
//   }

  searchUsers(e){
    getUsers(e.target.value).then((result) => { 
        if(result.code == 'ok'){
            var data = result.data;
            var users = [];
            for(var i = 0; i < data.length; i++){
                console.log(data[i].uid);
                const link = "/profile/"+data[i].uid;
                var f = <Row key={data[i].uid} className="pt-1 mt-2">
                <Col className="mt-auto mb-auto">
                    <Button variant="light" onClick={event =>  window.location.href=link} className="usm-user">
                        <Image
                            roundedCircle
                            fluid
                            src={"/images/nodp.png"}
                            width="35"
                            className="d-inline-flex ppic"
                            alt="dp"
                        />
                        <span className="ml-2 h6 username">{data[i].username}</span>
                    </Button>
                </Col>
                </Row>;
                users.push(f);
            }
            

            this.setState({users: users});
        }else{
          console.log(result.msg);
        }
      });
  }

  render() {
    return(
    <>
        <Modal 
            aria-labelledby="contained-modal-title-vcenter" 
            show={this.state.show} 
            centered
            onHide={this.handleClose}
        >
            <Modal.Body className="show-grid">
                <Container>
                <Row>
                    <Col>
                        <Form.Control 
                            type="text" 
                            placeholder="Search User..." 
                            className="mb-auto mt-2 nvh-search"
                            onChange={this.searchUsers}
                        />
                    </Col>
                </Row>
                {this.state.users}
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>

        <Button variant="primary" onClick={this.handleShow}>
            <FaSearch />
        </Button>
    </>
    );
  }
}