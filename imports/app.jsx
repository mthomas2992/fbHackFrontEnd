import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import {Geolocation} from 'meteor/mdg:geolocation';

import GoogleMapReact from 'google-map-react';
import Location from '/imports/location.jsx';
import Slider from '/imports/slider.jsx';
import Carousel from 'nuka-carousel';
import Validation from 'react-validation';

import Location from '/imports/location.jsx';
import AddStep from '/imports/addStep.jsx';
import ConfirmMission from '/imports/confirmMission.jsx';

import PlacesAutocomplete from 'react-places-autocomplete';
import {geocodeByAddress} from 'react-places-autocomplete';



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
        currUserID:3,
        missions: null,
        newMissionSteps:null,
        popup:false,
        name:"",
        desc:"",
        confirmMission:false,
        address:"",
        steps: null,
        addressList: null
      }

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.addStep = this.addStep.bind(this);
      this.makePopup = this.makePopup.bind(this);
      this.hidePopup=this.hidePopup.bind(this);
      this.finalSubmit = this.finalSubmit.bind(this);
      this.loadMissions = this.loadMissions.bind(this);
      this.hideConfirm = this.hideConfirm.bind(this);

      this.handleSelect = this.handleSelect.bind(this);
      this.handleChangeMaps = this.handleChangeMaps.bind(this);
    };

    componentWillMount(){
      this.loadMissions();
    }

    loadMissions(){
      var self = this;
      Meteor.call('getMissions',function (err,res){
        self.setState({missions:res});
      })
      Meteor.call('getSteps',function (err,res){
        self.setState({steps:res});
      })
    }

    //autocomplete place maps
    handleSelect(address) {
      this.setState({
        address,
        loading: true
      });
      geocodeByAddress(address,  (err, { lat, lng }) => {
        if (err) {
          this.setState({
            newMissionGeocodeResults: "error",
            loading: false
          })
        }
        this.setState({
          newMissionGeocodeResults: {lat,lng},
          loading: false
        })
      })
    }

    handleChangeMaps(address) {
      console.log("test");
      this.setState({
        address:address,
        geocodeResults: null
      })
    }

    finalSubmit(){
      this.setState({missions:null,newMissionSteps:null,popup:false,name:"",desc:"",confirmMission:false});
      this.loadMissions();
      FlowRouter.go('/');
    }

    handleSubmit(event){
      event.preventDefault();
      console.log(this.state);
      var totalCost = 0;
      if (this.state.newMissionSteps){
        for (k=0;k<this.state.newMissionSteps.length;k++){
          totalCost = totalCost + this.state.newMissionSteps[k].cost;
        }
      } else {
        return;
      }

      var newMissionToBePosted = {
        "name": this.state.name,
        "lat": this.state.newMissionGeocodeResults.lat,
        "long": this.state.newMissionGeocodeResults.lng,
        "author": this.state.currUserID,
        "desc": this.state.desc,
        "cost": totalCost,
        "num_users": "undefined",
      }

      this.setState({newMission:newMissionToBePosted});
      this.setState({confirmMission:true});
    }

    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    };

    addStep(type,name,desc){
      console.log(type,name,desc);
      console.log(this.state);
      var newStep = this.state.newMissionSteps;
      if (newStep==null){
        newStep = new Array();
      }
      newStep.push(
          {
            "type": type,
            "name" : name,
            "desc": desc,
            "cost": 0.30
          });
      console.log(newStep);
      this.setState({newMissionSteps:newStep});
      console.log(this.state.newMissionSteps);
    }

    makePopup(){
      this.setState({popup:true});
    }

    hidePopup(){
      this.setState({popup:false});
    }

    hideConfirm(){
      this.setState({confirmMission:false});
    }

    render() {

      const AutocompleteItem = ({ formattedSuggestion }) => (
        <div className="Demo__suggestion-item">
          <i className='fa fa-map-marker Demo__suggestion-icon'/>
          <strong>{formattedSuggestion.mainText}</strong>{' '}
          <small className="text-muted">{formattedSuggestion.secondaryText}</small>
        </div>);

      if (this.props.path == "home"){
        var test = Geolocation.latLng();
        console.log(test);
        var currLocations = new Array();
        var carouselElements = new Array();
        if (this.state.missions){
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
            carouselElements.push(<Slider name={this.state.missions[i].name}
              types={jobTypes}
              address={this.state.missions[i].address}
              desc={this.state.missions[i].desc}
              cost={this.state.missions[i].cost}/>);
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
                </div>);
      } else if (this.props.path == "missionCreator"){
        var currentSteps = new Array();
        if (this.state.newMissionSteps){
          for (j=0;j<this.state.newMissionSteps.length;j++){
            currentSteps.push(<div className = "col-xs-12" id = "step">Name {this.state.newMissionSteps[j].name} Desc{this.state.newMissionSteps[j].desc}</div>)
          }
        }
        currentSteps.push(<div onClick = {this.makePopup} className = "col-xs-12" id="stepPlaceHolder"> click to add step</div>)
        return (
          <div className = "container-fluid">
            <div className="row" id = "topHeader">
              <div className = "col-xs-8" id = "nameEditing">
                <Validation.components.Form onSubmit={this.handleSubmit}>
                  <Validation.components.Input id="formInput" name="name" type="text" value={this.state.name} onChange={this.handleChange} placeholder={"Name"} validations={['required']}/>
                  <Validation.components.Input id="formInput" name="desc" type="text" value={this.state.desc} onChange={this.handleChange} placeholder={"Desc"} validations={['required']}/>
                </Validation.components.Form>
                <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleChangeMaps}
                    onSelect={this.handleSelect}
                    autocompleteItem={AutocompleteItem}
                    placeholder="Search Places"
                    hideLabel={true}
                    inputName="fromAddress"
                  />
              </div>
              <div className = "col-xs-4" id = "cost">
                Cost will go here
              </div>
            </div>
            <div className = "row" id = "stepSection">
              {currentSteps}
            </div>
            <div className= "row" id = "submitMission">
              <Validation.components.Form onSubmit={this.handleSubmit}>
                <input type="submit" value="Submit mission" id="submitButton" />
              </Validation.components.Form>
            </div>
            <AddStep enable = {this.state.popup} addStep = {this.addStep} hidePopup={this.hidePopup}/>
            <ConfirmMission enable = {this.state.confirmMission} toBeConfirmed = {this.state.newMission} finalSubmit = {this.finalSubmit} hideConfirm={this.hideConfirm} steps = {this.state.newMissionSteps}/>
          </div>
        )
      } else {
        return (<div>404</div>)
      }
    }
}

export default App;
