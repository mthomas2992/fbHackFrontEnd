import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import Scroll from 'react-scroll';

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

    nextStep(nextStep,id,data,type){
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
        Meteor.call('getImageUrl',data,function(err,res){
          Meteor.call('createResult',self.props.userID,newID,res,function(err,res){
            if (res) {
              scroller.scrollTo(nextString, {
                  duration: 1500,
                  delay: 0,
                  smooth: true,
                });
              this.setState({verificationStatus:"Next Step"});
            } else {
              this.setState({verificationStatus:"Sorry, verification failed"});
            }
          })
        })
      }

    }

    finishMission() {
      this.setState({steps:null,loadingSteps:false,currStep:0});
      FlowRouter.go('/');
    }

    takePhoto(step){
      var screenshot = this.refs[step].getScreenshot();
      var full =screenshot.split(",");
      console.log(full);
      console.log(full[1]);
      this.setState({[step]:full[1]});
      console.log(screenshot);
    }

    render() {
      console.log(this.props);
      if (this.state.loadingSteps == false){
        var steps = new Array();
        steps.push(<Element name="0">
                      <div id = "stepComplete" className ="row">
                        <div className = "col-xs-12">
                            Mission brief will go here
                        </div>
                        <div onClick={()=>{this.nextStep(1,"","","skip")}}> Start mission</div>
                      </div>
                    </Element>);
        for (s=0;s<this.state.steps.length;s++){
          console.log(this.state.steps[s]);
          if (this.state.steps[s].type=="camera"){
            var camRef = "webcam"+(s+1);
            var currId = this.state.steps[s].id;
            steps.push(<Element name={""+(s+1)+""}>
                        <div id="stepComplete" className = "row">
                          <div className = "col-xs-12">
                            Step {this.state.steps[s].name}
                            id {this.state.steps[s].id}
                            <Webcam
                              screenshotFormat = 'image/jpeg'
                              width='212'
                              height='160'
                              ref={camRef}/>
                          </div>
                          <div onClick={()=>{this.takePhoto(camRef)}}> take photo</div>
                          <div onClick={()=>{this.nextStep(s+2,currId,this.state[camRef],"camera")}}> {this.state.verificationStatus}</div>
                        </div>
                      </Element>)
          } else {
            steps.push(<Element name={""+(s+1)+""}>
                        <div id="stepComplete" className = "row">
                          <div className = "col-xs-12">
                            Step {this.state.steps[s].name}
                          </div>
                          <div onClick={()=>{this.nextStep(s+2)}}> {this.state.verificationStatus}</div>
                        </div>
                      </Element>)
          }

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
