import React, { Component } from 'react';
import './ReusableButton.css';
//import your icons here
import {FaCamera, FaEnvelope, FaCheck} from 'react-icons/fa';

class ReusableButton extends Component {

   //this function will identify what icon to render
   renderIcon() {
     switch(this.props.btnText) {
       case 'newpost': return <FaCamera />;
       case 'message': return <FaEnvelope />;
       case 'verified': return <FaCheck />;
     }
   }

   render() {
       return(
           <div className='button align-items-center'>
               {this.renderIcon()}
               <a href={this.props.link}>
                    {this.props.btnText} 
               </a>
           </div>
       )
   }
}

export default ReusableButton;