import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class ConfirmMission extends React.Component {

    constructor(props){
      super(props);
      this.state ={
        loading :false
      }
      this.postMission=this.postMission.bind(this);
    };

    postMission(){
      this.setState({loading:true});
      var self = this;
      Meteor.call('createNewMission',this.props.toBeConfirmed.name,this.props.toBeConfirmed.lat,this.props.toBeConfirmed.long,this.props.toBeConfirmed.author
      ,this.props.toBeConfirmed.desc,this.props.toBeConfirmed.cost,5,function(err,res){
        console.log(res.data.id);
        Meteor.call('createSteps',self.props.steps,res.data.id,function(err,res){
          if (res){
            this.setState({loading:false});
            this.props.finalSubmit();
          }
        })
      })
    }

    cancelMission(){
      this.props.hideConfirm();
    }

    render() {
      if (this.props.enable){
        if (this.state.loading==false){
          return (<div id = "confirmMission">
                    <div id="cfm-text">
                      Name : {this.props.toBeConfirmed.name}</div>
                      <br></br>
                      <div id="cfm-text">
                      Lat : {this.props.toBeConfirmed.lat}</div>
                      <br></br>
                      <div id="cfm-text">
                      Long : {this.props.toBeConfirmed.long}</div>
                      <br></br>
                      <div id="cfm-text">
                      Author : {this.props.toBeConfirmed.author}</div>
                      <br></br>
                      <div id="cfm-text">
                      Desc : {this.props.toBeConfirmed.desc}</div>
                      <br></br>
                      <div id="cfm-text">
                      Cost : {this.props.toBeConfirmed.cost}</div>
                      <br></br>
                    <div id="cfm-btn" onClick={()=>{this.postMission()}}> Submit</div>
                    <div id="cfm-btn" onClick={()=>{this.cancelMission()}}> Cancel</div>
                  </div>)
        } else {
          return (<div></div>)
        }

      } else {
        return (<div></div>)
      }


    }
}

export default ConfirmMission;
