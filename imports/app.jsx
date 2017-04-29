import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import {Geolocation} from 'meteor/mdg:geolocation';

import GoogleMapReact from 'google-map-react';
import Location from '/imports/location.jsx';
import Carousel from 'nuka-carousel';

class App extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        missions: null,
      }

    };

    componentWillMount(){
      var self = this;
      Meteor.call('getMissions',function (err,res){
        self.setState({missions:res});
      })
    }


    render() {
      var test = Geolocation.latLng();
      console.log(test);
      var currLocations = new Array();
      var carouselElements = new Array();
      if (this.state.missions){
        console.log(this.state.missions);
        for (i=0;i<this.state.missions.length;i++){
          currLocations.push(<Location lat= {this.state.missions[i].lat} lng = {this.state.missions[i].long}/>);
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
