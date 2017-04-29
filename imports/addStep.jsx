import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import Validation from 'react-validation';


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
        creationType : "",
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
                    <div onClick={()=>{this.advanceStep("camera")}}> camera </div>
                    <div onClick={()=>{this.advanceStep("shortQ")}}> short term answer </div>
                    <div onClick={()=>{this.advanceStep("longQ")}}> long term answer </div>
                    <div onClick={()=>{this.advanceStep("direction")}}> direction </div>
                    <div onClick={()=>{this.advanceStep("work")}}> work </div>
                  </div>)
        } else {
          return (<div className = "row" id = "popUp">
            {this.state.creationType}
            <Validation.components.Form onSubmit={this.handleSubmit}>
              <Validation.components.Input id="formInput" name="name" type="text" value={this.state.name} onChange={this.handleChange} placeholder={"Name"} validations={['required']}/>
              <Validation.components.Input id="formInput" name="desc" type="text" value={this.state.desc} onChange={this.handleChange} placeholder={"Desc"} validations={['required']}/>
              <input type="submit" value="Create step" id="submitButton" />
            </Validation.components.Form>
          </div>)
        }

      } else {
        return (<div></div>)
      }


    }
}

export default AddStep;
