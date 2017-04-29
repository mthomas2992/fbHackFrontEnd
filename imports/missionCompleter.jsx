import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import Scroll from 'react-scroll';
import Validation from 'react-validation';

const PHOTO_ICON = "http://icons.iconarchive.com/icons/pelfusion/long-shadow-media/512/Camera-icon.png";
const TRAVEL_ICON = "https://cdn2.iconfinder.com/data/icons/flatte-maps-and-navigation/80/04_-_Walking-512.png";
const WORK_ICON = "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-35-512.png";
const SHORTQ_ICON = "http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-question-icon.png";
const LONGQ_ICON = "http://www.intensivewatch.com/pc/img/icons/ic-register.png";
var icon_links = {
  "camera":PHOTO_ICON,
  "direction":TRAVEL_ICON,
  "work":WORK_ICON,
  "shortQ":SHORTQ_ICON,
  "longQ":LONGQ_ICON
};
var icon_text = {
  "camera": "Take a Photo",
  "direction" : "Visit a Location",
  "work": "Complete a Task",
  "shortQ": "Answer Short Questions",
  "longQ":"Complete Survey"
}

var Link = Scroll.Link;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;
var scroller = Scroll.scroller;

import Webcam from 'react-webcam';

class MissionCompleter extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        steps:null,
        loadingSteps:false,
        currStep:0,
        verificationStatus:"Next Step"
      }

      this.nextStep = this.nextStep.bind(this);
      this.finishMission = this.finishMission.bind(this);
      this.takePhoto = this.takePhoto.bind(this);
      this.handleChange = this.handleChange.bind(this);
    };

    componentWillMount(){
      var newSteps = new Array();
      this.setState({loadingSteps:true});
      var self = this;
      for (j=0;j<this.props.missionDetails.steps.length;j++){
        Meteor.call('getStep',this.props.missionDetails.steps[j],function(err,res){
          newSteps.push(res.data);
          self.setState({steps:newSteps});
          if (newSteps.length == self.props.missionDetails.steps.length){
            self.setState({loadingSteps:false});
          }
        })
      }
    }

    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    };

    nextStep(nextStep,id,data,type,step){
      var nextString = nextStep.toString();
      if (type=="skip"){
        scroller.scrollTo(nextString, {
            duration: 1500,
            delay: 0,
            smooth: true,
          });
        return;
      }
      var self = this;
      var newID = id;
      this.setState({verificationStatus:"Verifying.."});
      if (type == "camera"){
        var screenshot = this.refs[step].getScreenshot();
        var full =screenshot.split(",");
        Meteor.call('getImageUrl',full[1],function(err,res){
          console.log(res);
          Meteor.call('createResult',self.props.userID,newID,res,function(err,res){
            if (res) {
              scroller.scrollTo(nextString, {
                  duration: 1500,
                  delay: 0,
                  smooth: true,
                });
              self.setState({verificationStatus:"Next Step"});
            } else {
              self.setState({verificationStatus:"Sorry, verification failed"});
            }
          })
        })
      } else if (type == "shortQ"){
        Meteor.call('createResult',self.props.userID,newID,self.state[camRef],function(err,res){
          if (res) {
            scroller.scrollTo(nextString, {
                duration: 1500,
                delay: 0,
                smooth: true,
              });
            self.setState({verificationStatus:"Next Step"});
          } else {
            self.setState({verificationStatus:"Sorry, verification failed"});
          }
        })
      }

    }

    finishMission() {
      this.setState({steps:null,loadingSteps:false,currStep:0});
      FlowRouter.go('/home');
    }

    takePhoto(step){

    }

    render() {
      if (this.state.loadingSteps == false){
        var curStep = this.state.steps[this.state.currStep];
        var icon = '';
        if (parseInt(curStep.mission) == i) {
          switch(curStep.type) {
            case "camera":
              icon=icon_links[0]; break;
            case "photo":
              icon=icon_links[0]; break;
            case "direction":
              icon=icon_links[1]; break;
            case "shortQ":
              icon=icon_links[3]; break;
            case "sht_ans":
              icon=icon_links[3]; break;
            case "longQ":
              icon=icon_links[4]; break;
            case "work":
              icon=icon_links[2]; break;
            default: break;
          }
        }
        var steps = new Array();
        steps.push(<Element name="0">
                      <div id = "stepComplete" className ="row">
                        <img src={icon}></img>
                        <div className = "col-xs-12" id="step-do-title">
                            {this.props.missionDetails.name}
                        </div>
                        <div className = "col-xs-12" id="step-do-subtitle">
                            Task: {curStep.name}
                        </div>
                        <div id="step-do-mission-btn"
                          onClick={()=>{this.nextStep(1,"","","skip")}}> Start Mission</div>
                      </div>
                    </Element>);
        for (s=0;s<this.state.steps.length;s++){
          var body = null;
          var camRef = "webcam"+(s+1);
          if (this.state.steps[s].type=="camera"){
            var currId = this.state.steps[s].id;
            var interpretStatus = this.state.verificationStatus
            if (interpretStatus=="Next Step"){
              interpretStatus = "Take photo"
            }
            body= <div className = "col-xs-12" id="step-do-subtitle">
                      <div className = "row" id="camera">
                        <Webcam
                          screenshotFormat = 'image/jpeg'
                          width='300'
                          height='300'
                          ref={camRef}/>
                      </div>
                      <div className = "row"
                        onClick={()=>{this.nextStep(s+2,currId,this.state[camRef],
                        "camera",camRef)}}> {interpretStatus}</div>
                  </div>
          } else {
            body= <div className = "col-xs-12">
                      <div className = "row">
                        <Validation.components.Form onSubmit={this.handleSubmit}>
                          <Validation.components.Input
                            id="mission-form-input" name={camRef}
                            type="text" value={this.state.name}
                            onChange={this.handleChange}
                            placeholder={"Your answer here.."} validations={['required']}/>
                        </Validation.components.Form>
                      </div>
                      <div className = "row" onClick={()=>{this.nextStep(s+2,currId,this.state[camRef],"shortQ",camRef)}}> {this.state.verificationStatus}</div>
                  </div>;
          }
          steps.push(<Element name={""+(s+1)+""}>
                        <div id="stepComplete" className = "row">
                          <div className = "col-xs-12" id="step-activity-subtitle">
                            {this.state.steps[s].name}
                          </div>
                          <div className = "col-xs-12" id="step-activity-subtitle">
                            {this.state.steps[s].desc}
                          </div>
                          {body}
                        </div>
                      </Element>)

        };

        steps.push(<Element name={""+(s+2)+""}>
                    <div id="stepComplete" className = "row">
                      <div className = "col-xs-12">
                        Mission complete
                      </div>
                      <div onClick={()=>{this.finishMission()}}> Back home</div>
                    </div>
                  </Element>);

        return (<div>
            {steps}
            </div>)
      } else {
        return (<div> loading steps....</div>)
      }

    }
}

export default MissionCompleter;
