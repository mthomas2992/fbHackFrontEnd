import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';


const PHOTO_ICON = "http://icons.iconarchive.com/icons/pelfusion/long-shadow-media/512/Camera-icon.png";
const TRAVEL_ICON = "https://cdn2.iconfinder.com/data/icons/flatte-maps-and-navigation/80/04_-_Walking-512.png";
const WORK_ICON = "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-35-512.png";
const SHORTQ_ICON = "http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-question-icon.png";
const LONGQ_ICON = "http://www.intensivewatch.com/pc/img/icons/ic-register.png";

class IconMini extends React.Component {

    constructor(props){
      var icon_links = [PHOTO_ICON, TRAVEL_ICON, WORK_ICON, SHORTQ_ICON, LONGQ_ICON];
      super(props);
      this.state = {
        imageLink : icon_links[props.type],
      }
    };

    render() {
      return (<div>
        <img id="loc-icon-mini" src={this.state.imageLink}></img>
          </div>)
    }
}

export default IconMini;


// <form onSubmit={this.handleSubmit}>
//   <h1>First if we could start with your name, phone number and address</h1>
//   <h2>Name:</h2>
//   <input ref={(input) => { this.id0 = input; }} id="formInput" name="name" type="text" value={this.state.name} onChange={this.handleChange} />
//   <h2>Phone:</h2>
//   <input id="formInput" name="phone" type="text" value={this.state.name} onChange={this.handleChange} />
//   <h2>Address:</h2>
//   <input id="formInput" name="name" type="text" value={this.state.name} onChange={this.handleChange} />
//
//
// </form>
