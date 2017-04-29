import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import IconMini from '/imports/miniIcon.jsx';

class Slider extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        name: props.name,
        types:props.types,
        address:props.address,
        desc: props.desc,
        cost: props.cost
      }
    };

    render() {
      var miniIcons = new Array();
      for (i=0;i<5;i++) {
        if(this.state.types[i]>0) {
          miniIcons.push(<IconMini type={i}/>)
        }
      }
      return (
        <div id='slider'>
          {miniIcons}
          <div id='mission-title'>{this.state.name}</div>
          <div id='mission-desc'>{this.state.desc}</div>
          <div id='mission-details'>{this.state.address}</div>
          <div id='mission-details'>${this.state.cost}</div>

        </div>)
    }
}

export default Slider;
