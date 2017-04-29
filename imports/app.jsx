import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import GoogleMapReact from 'google-map-react';

class App extends React.Component {

    constructor(props){
      super(props);

    };


    render() {
    return (<div id = "mainMap">
      <GoogleMapReact
        center={[-33.8688197, 151.20929550000005]}
      zoom={15}>

</GoogleMapReact>
            </div>)

    }
}

export default App;
