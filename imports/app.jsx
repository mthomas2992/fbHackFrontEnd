import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import {Geolocation} from 'meteor/mdg:geolocation';

import GoogleMapReact from 'google-map-react';
import Location from '/imports/location.jsx';

class App extends React.Component {

    constructor(props){
      super(props);

    };

    componentWillMount(){
      Meteor.call('getMissions',function (err,res){
        console.log(res);
      })
    }


    render() {
      var test = Geolocation.latLng();
      console.log(test);
      return (<div className="container-fluid">
                  <div className = "row" id ="mainMap">
                    <GoogleMapReact
                      center={[-33.8688197, 151.20929550000005]}
                      zoom={15}
                    >

                    </GoogleMapReact>
                  </div>
              </div>)

    }
}

export default App;
