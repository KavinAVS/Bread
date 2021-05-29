import React, {Component} from 'react';
import PostCard from '../components/PostCard.js';
import VideoCard from '../components/VideoCard.js';

export default class PostList extends Component {

  static defaultProps = {
    showUser: true, 
    showComment: true,
    picsrcs:["/images/nopic.jpg"],
    vidsrcs:["/images/novideo.png"],
    pids: []
  };

  constructor(props) {
    super(props);
    this.posts = [];
  }

  makeList() {
    this.posts = [];
    for(var i = this.props.pids.length - 1; i >= 0; i--) {
      this.posts.push(
        <PostCard
          key={i}
          showUser={this.props.showUser} 
          showComment={this.props.showComment}
          src={this.props.picsrcs[i]}
          pid={this.props.pids[i]}
        />);
    }

    if(this.props.pids.length == 0){
      this.posts = <PostCard
      key={i}
      showUser={false} 
      showComment={false}
      showLike={false}
    />;
    }

    // for(var i = 0; i < this.props.vidsrcs.length; i++) {
    //   this.posts.push(
    //     <VideoCard
    //       key={i+this.props.picsrcs.length}
    //       showUser={this.props.showUser} 
    //       showComment={this.props.showComment}
    //       src={this.props.vidsrcs[i]}
    //     />);
    // }
  }

  render() {
    this.makeList();
    return(
      <>
        {this.posts}
      </>
    );
  }
}