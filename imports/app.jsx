import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import {Geolocation} from 'meteor/mdg:geolocation';

import GoogleMapReact from 'google-map-react';
import Location from '/imports/location.jsx';
import Carousel from 'nuka-carousel';


// Types of Work
const PHOTO = 0;
const TRAVEL = 1;
const WORK = 2;
const SHORTQ = 3;
const LONGQ = 4;

class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        missions: null,
        steps: null,
      }

    };

    componentWillMount(){
      var self = this;
      Meteor.call('getMissions',function (err,res){
        self.setState({missions:res});
      })
      Meteor.call('getSteps',function (err,res){
        self.setState({steps:res});
      })
    }


    render() {
      var test = Geolocation.latLng();
      console.log(test);
      var currLocations = new Array();
      var carouselElements = new Array();
      if (this.state.missions && this.state.steps){
        console.log(this.state.missions);

        for (i=0;i<this.state.missions.length;i++){

          // Count up task types
          var jobTypes=[0,0,0,0,0];
          for (j=0; j<this.state.steps[j].length; j++) {
            if (parseInt(this.state.steps[i].mission) == j) {
              switch(this.state.steps[i].type) {
                case "photo":
                  jobTypes[PHOTO] += 1; break;
                case "travel":
                  jobTypes[TRAVEL] += 1; break;
                case "shortQ":
                  jobTypes[SHORTQ] += 1;  break;
                case "longQ":
                  jobTypes[LONGQ] += 1; break;
                case "work":
                  jobTypes[WORK] += 1; break;
                default: break;
              }
            }
          }

          var missionType = 0;
          for (j=0; j<5; j++) {
            if (jobTypes[j] > jobTypes[missionType]) {
                missionType = j;
            }
          }

          currLocations.push(<Location type={missionType} lat= {this.state.missions[i].lat} lng = {this.state.missions[i].long}/>);
          carouselElements.push(<div>{this.state.missions[i].name}</div>)
        }
      }

      return (<div className="container-fluid">
                  <div className = "row" id ="mainMap">
                    <GoogleMapReact
                      center={[-33.8688197, 151.20929550000005]}
                      zoom={15}
                    >
                    {currLocations}
                    </GoogleMapReact>
                  </div>
                  <div className = "row">
                    <Carousel>
                      {carouselElements}

                    </Carousel>
                  </div>
              </div>)

    }
}

export default App;
