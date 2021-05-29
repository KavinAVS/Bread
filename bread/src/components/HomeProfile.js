import React, { Component } from 'react';
import Media from 'react-bootstrap/Media';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReusableButton from './ReusableButton.js';
import { getUserdata } from '../firebase';
import { Auth } from '../context';
import { FaCheck } from 'react-icons/fa';
import './HomeProfile.css';


export default class HomeProfile extends Component {
    
    static contextType = Auth;
    static defaultProps = {
        dp: '/images/nodp.png',
    }

    constructor(props) {
        super(props);
        this.state = {
            username:"Loading...",
            followers: 0,
            following: 0,
            points: 0,
            verified: false
        };
        this.got = false;
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update(){
        let {isLoggedIn, uid} = this.context;

        if(uid !== undefined && !this.got){
            var data = {}
            getUserdata(uid, 'username').then((result) => {
                if(result.code == 'ok') {
                    data.username = result.data;
                } else{
                this.setState({username:"Error: User not found"});
                console.log(result.msg);
                }
            }).then(
            getUserdata(this.props.uid, 'num_followers').then((result) => { 
                if(result.code == 'ok') {
                    data.followers = result.data;
                } else{
                console.log(result.msg);
                }
            })).then(
            getUserdata(this.props.uid, 'num_following').then((result) => { 
                if(result.code == 'ok') {
                    data.following = result.data;
                } else{
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
            })).then( () => {
                this.setState(data);
                this.got = true
            });
        }
    }

    render() {
        let {isLoggedIn, uid} = this.context;

        var verf;
        if(this.state.verified == true){
            verf = <FaCheck className="hp-verified" aria-hidden={this.state.verified} />; 
        }

        return (
            <Media className="pt-5 pb-4 mr-0 mp-0 hp-container">
                <Image className="ppic"
                    roundedCircle
                    fluid
                    src={this.props.dp}
                    alt="Logo"
                />
                <Media.Body>
                    <div className="hp-username">
                        <h4 className="ml-4 mr-1">{this.state.username} </h4>
                        {verf}
                    </div>
                    
                    <Container className="pt-1 pb-1 ml-0">
                        <Row>
                            <Col className='text-center'>
                                <Row className='ml-4 mr-4 justify-content-between'>
                                    <p xs={2} className="h6 mr-3 hp-stats">Followers</p>
                                    <p className="h6 hp-stats">{this.state.followers}</p>
                                </Row>

                                <Row className='ml-4 mr-4 justify-content-between'>
                                    <p xs={2} className="h6 mr-3 hp-stats">Following</p>
                                    <p className="h6 hp-stats">{this.state.following}</p>
                                </Row>

                                <Row className='ml-4 mr-4 justify-content-between'>
                                    <p xs={5} className="h6 mr-3 hp-stats">Points</p>
                                    <p className="h6 hp-stats">{this.state.points}</p>
                                </Row>
                            </Col>
                        </Row>

                        <Container className="hp-functions">
                            <Row xs={3} className="ml-3 newpost text-center justify-content-start">
                                <ReusableButton btnText='newpost' link='../newpost' />
                            </Row>
                            <Row xs={3} className="ml-3 message text-center justify-content-start">
                                <ReusableButton btnText='message' link='' />
                            </Row>
                        </Container>               
                    </Container>
                </Media.Body>
            </Media>
        );
    }
}