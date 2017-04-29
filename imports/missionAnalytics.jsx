import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class MissionAnalytics extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        missionDetails:null,
        missionStepDetails:null
      }
    };

    componentWillMount(){
      var self = this;
      Meteor.call('getMission',this.props.missionActive,function(err,res){
        self.setState({missionDetails:res});
        Meteor.call('getResultsData',res.steps, function(err,res){
          self.setState({missionStepDetails:res});
          console.log(res);
        })
      })
    }
    render() {
      if (this.state.missionStepDetails){
        console.log(this.state.missionDetails);
        var resultPages= new Array();
        for (k=0;k<this.state.missionDetails.steps.length;k++){
          var elementToBePushed = new Array();
          for (j=0;j<this.state.missionStepDetails.length;j++){
            if (this.state.missionStepDetails[j].step == this.state.missionDetails.steps[k]){
              if (this.state.missionStepDetails[j].stepInfo.type == "camera"){
                elementToBePushed.push(<div className= "col-xs-12" id= "imgDivRoot"><img id="imgDisp" src={this.state.missionStepDetails[j].content}></img></div>)
              } else if (this.state.missionStepDetails[j].stepInfo.type == "shortQ"){
                elementToBePushed.push(this.state.missionStepDetails[j].content)
              }

            }
          }
          resultPages.push(
            <div id="rootStepAnalytics" className="row">
                    <div className = "col-xs-12" id="step-analysis-title">
                      Step: {k+1} , {this.state.missionStepDetails[k].stepInfo.name}
                    </div>
                    {elementToBePushed}
                  </div>);
        }
        if (resultPages.length==0){
          resultPages=<div>No Results yet!</div>;
        }
        return (<div className="row" >
                  <div className = "col-xs-12" id = "topHeader">
                    <div id="mission-analytics-name">
                      Mission Analytics
                    </div>
                  </div>
                  {resultPages}
                </div>
                )
      } else {
        return (<div>
          Loading Analytics data....
        </div>)
      }

    }
}

export default MissionAnalytics;
