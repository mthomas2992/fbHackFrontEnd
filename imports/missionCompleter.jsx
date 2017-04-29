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

class MissionCompleter extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        steps:null,
        loadingSteps:false,
        currStep:0
      }

      this.nextStep = this.nextStep.bind(this);

    };

    componentWillMount(){
      var newSteps = new Array();
      this.setState({loadingSteps:true});
      var self = this;
      for (j=0;j<this.props.missionDetails.steps.length;j++){
        Meteor.call('getStep',this.props.missionDetails.steps[j],function(err,res){
          newSteps.push(res);
          self.setState({steps:newSteps});
          if (newSteps.length == self.props.missionDetails.steps.length){
            self.setState({loadingSteps:false});
          }
        })
      }
    }

    nextStep(nextStep){
      var nextString = nextStep.toString();
      scroller.scrollTo(nextString, {
          duration: 1500,
          delay: 0,
          smooth: true,
        });
    }

    render() {
      console.log(this.props);
      if (this.state.loadingSteps == false){
        var steps = new Array();
        for (s=0;s<this.state.steps.length;s++){
          steps.push(<Element name={""+(s+1)+""}>
                      <div className = "row">
                        Step {this.state.steps[s].name}
                      </div>
                      <div className="row">
                        <div onClick={()=>{this.nextStep(s+2)}}> Next Step</div>
                      </div>
                    </Element>)
        }

        return (<div>
            {steps}
            </div>)
      } else {
        return (<div> loading steps....</div>)
      }

    }
}

export default MissionCompleter;
