import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';


const PHOTO_ICON = "http://icons.iconarchive.com/icons/pelfusion/long-shadow-media/512/Camera-icon.png";
const TRAVEL_ICON = "https://cdn2.iconfinder.com/data/icons/flatte-maps-and-navigation/80/04_-_Walking-512.png";
const WORK_ICON = "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-35-512.png";
const SHORTQ_ICON = "http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-question-icon.png";
const LONGQ_ICON = "http://www.intensivewatch.com/pc/img/icons/ic-register.png";
const OUR_LOC = "https://proximityinternational.files.wordpress.com/2014/07/orange-dot.png";

class Location extends React.Component {

    constructor(props){
      var icon_links = [PHOTO_ICON, TRAVEL_ICON, WORK_ICON, SHORTQ_ICON, LONGQ_ICON, OUR_LOC];
      super(props);
      this.state = {
        imageLink : icon_links[props.type],
      }
    };
    //<img style={{width: 40}} src={this.state.imgLink}> </img>


    render() {
      return (<div>
        <img id="loc-icon" src={this.state.imageLink}></img>
          </div>)
    }
}

export default Location;
