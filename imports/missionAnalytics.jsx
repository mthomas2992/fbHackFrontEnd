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
        var resultPages= new Array();
        // for (k=0;k<this.state.missionStepDetails.length;k++){
        //
        // }
        return (<div className="row" >
                  <div className = "col-xs-12" id = "topMissionAnalyticsHeader">
                    Mission analytics for {this.props.missionActive}
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
