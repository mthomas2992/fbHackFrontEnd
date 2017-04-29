import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import Validation from 'react-validation';

const PHOTO_ICON = "http://icons.iconarchive.com/icons/pelfusion/long-shadow-media/512/Camera-icon.png";
const TRAVEL_ICON = "https://cdn2.iconfinder.com/data/icons/flatte-maps-and-navigation/80/04_-_Walking-512.png";
const WORK_ICON = "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-35-512.png";
const SHORTQ_ICON = "http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-question-icon.png";
const LONGQ_ICON = "http://www.intensivewatch.com/pc/img/icons/ic-register.png";
var icon_links = [PHOTO_ICON, TRAVEL_ICON, WORK_ICON, SHORTQ_ICON, LONGQ_ICON];
var icon_text = {
  "camera": "Take a Photo",
  "direction" : "Visit a Location",
  "work": "Complete a Task",
  "shortQ": "Answer Short Questions",
  "longQ":"Complete Survey"
}

class AddStep extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        currStep:0,
        creationType : "",
        name:"",
        desc:""
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);

    };

    advanceStep(type){
      this.setState({currStep:1,creationType:type});
    }

    handleSubmit(event){
      event.preventDefault();

      this.props.addStep(this.state.creationType,this.state.name,this.state.desc);
      this.state = {
        currStep:0,
        creationType : 0,
        name:"",
        desc:""
      }
      this.props.hidePopup();
    }

    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    };

    render() {

      if (this.props.enable==true){
        if (this.state.currStep==0){
          return (<div className = "row" id = "popUp">
                    <div onClick={()=>{this.advanceStep("camera")}}>
                      <img id="popup-icon" src={icon_links[0]}></img>
                      <p id="step-info">{icon_text["camera"]}</p></div>
                    <div onClick={()=>{this.advanceStep("work")}}>
                      <img id="popup-icon" src={icon_links[2]}></img>
                      <p id="step-info">{icon_text["work"]}</p></div>
                    <div onClick={()=>{this.advanceStep("shortQ")}}>
                      <img id="popup-icon" src={icon_links[3]}></img>
                      <p id="step-info">{icon_text["shortQ"]}</p></div>
                    <div onClick={()=>{this.advanceStep("longQ")}}>
                      <img id="popup-icon" src={icon_links[4]}></img>
                      <p id="step-info">{icon_text["longQ"]}</p></div>
                    <div onClick={()=>{this.advanceStep("direction")}}>
                      <img id="popup-icon" src={icon_links[1]}></img>
                      <div id="step-info">{icon_text["direction"]}</div></div>

                  </div>)
        } else {

          return (<div className = "row" id = "popUp">
            <div id='step-title'>{icon_text[this.state.creationType]}</div>
            <Validation.components.Form onSubmit={this.handleSubmit}>
              <br></br>
              <Validation.components.Input id="step-form-input" name="name"
                type="text" value={this.state.name}
                onChange={this.handleChange}
                placeholder={"Task Name"} validations={['required']}/>
              <br></br>
              <Validation.components.Input
                id="step-form-input" name="desc"
                type="text" value={this.state.desc}
                onChange={this.handleChange}
                placeholder={"Task Description"} validations={['required']}/>
              <br></br>
              <br></br>
              <input type="submit" value="Create step" id="create-step-btn" />
            </Validation.components.Form>
          </div>)
        }

      } else {
        return (<div></div>)
      }


    }
}

export default AddStep;
