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
import AddStep from '/imports/addStep.jsx';
import ConfirmMission from '/imports/confirmMission.jsx';
import PlacesAutocomplete from 'react-places-autocomplete';
import {geocodeByAddress} from 'react-places-autocomplete';
import MissionCompleter from '/imports/missionCompleter.jsx';


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

const ORANGE_CIRCLE = "https://www.att.com/Investor/ATT_Annual/2012/_images/innovation/orange_circle.png"
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
        cost:0.00,
        confirmMission:false,
        address:"",
        steps: null,
        addressList: null,
        currentMissionDetails:null,
        currentMissionSteps:null
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
      this.startMission = this.startMission.bind(this);
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
      if (this.state.newMissionSteps){
        for (k=0;k<this.state.newMissionSteps.length;k++){
          this.state.cost = totalCost + this.state.newMissionSteps[k].cost;
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
        "cost": this.state.cost,
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

    startMission(){
      FlowRouter.go('/missionCompleter')
    }

    maxHeight (className) {
      var cols = document.getElementsByClassName(className);
      for(i=0; i<cols.length; i++) {
        cols[i].style.height = '100%';
      }
    }

    componentDidUpdate() {
      this.maxHeight('slider');
      this.maxHeight('slider-frame');
      this.maxHeight('slider-list');
      this.maxHeight('slider-slide');

      var cols = document.querySelectorAll("ul");
      for(i=0; i<cols.length; i++) {
        cols[i].style.height = '100%';
      }
    }

    render() {
      const AutocompleteItem = ({ formattedSuggestion }) => (
        <div className="Demo__suggestion-item">
          <i className='fa fa-map-marker Demo__suggestion-icon'/>
          <strong>{formattedSuggestion.mainText}</strong>{' '}
          <small className="text-muted">{formattedSuggestion.secondaryText}</small>
        </div>);

      if (this.state.missions==null){
        return (<div>loading....</div>)
      } else if (this.props.path == "home"){
        var currLocations = new Array();
        var carouselElements = new Array();
        var jobTypes=[0,0,0,0,0];
        if (this.state.missions){
          for (i=0;i<this.state.missions.length;i++){

            // Count up task types
            jobTypes=[0,0,0,0,0];
            for (j=0; j<this.state.steps.length; j++) {
              if (parseInt(this.state.steps[j].mission) == i) {
                switch(this.state.steps[i].type) {
                  case "camera":
                    jobTypes[PHOTO]++; break;
                  case "photo":
                    jobTypes[PHOTO]++; break;
                  case "direction":
                    jobTypes[TRAVEL]++; break;
                  case "shortQ":
                    jobTypes[SHORTQ]++;  break;
                  case "sht_ans":
                    jobTypes[SHORTQ]++;  break;
                  case "longQ":
                    jobTypes[LONGQ]++; break;
                  case "work":
                    jobTypes[WORK]++; break;
                  default: break;
                }
              }
            }
            console.log(jobTypes);
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
              cost={this.state.missions[i].cost}
              id={this.state.missions[i].id}/>);
          }
        }

        var Decorators = [{     //Removed buttons
        component: React.createClass({
          render() {return null }})}];

        return (<div className="container-fluid">
                    <div className = "row" id ="mainMap">
                      <GoogleMapReact
                        center={[-33.8688197, 151.20929550000005]}
                        zoom={15}
                      >
                      {currLocations}
                      </GoogleMapReact>
                    </div>
                    <div className = "row" id = "carousel">
                      <Carousel decorators={Decorators}
                        afterSlide={this.afterSlide}>
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
        currentSteps.push(<div onClick = {this.makePopup} className = "col-xs-12" id="stepPlaceHolder">+ Create New Step</div>)
        return (
          <div className = "container-fluid">
            <div className="row" id = "topHeader">
              <div className = "col-xs-8" id = "nameEditing">
                <Validation.components.Form onSubmit={this.handleSubmit}>
                  <Validation.components.Input
                    id="mission-form-input" name="name"
                    type="text" value={this.state.name}
                    onChange={this.handleChange}
                    placeholder={"Mission Name"} validations={['required']}/>
                  <br></br>
                  <Validation.components.Input
                    id="mission-form-input" name="desc"
                    type="text" value={this.state.desc}
                    onChange={this.handleChange}
                    placeholder={"Mission Description"} validations={['required']}/>
                <br></br>
                </Validation.components.Form>
                <PlacesAutocomplete
                    id="mission-form-input"
                    value={this.state.address}
                    onChange={this.handleChangeMaps}
                    onSelect={this.handleSelect}
                    autocompleteItem={AutocompleteItem}
                    placeholder="Location"
                    hideLabel={true}
                    inputName="fromAddress"
                  />
              </div>
              <div className = "col-xs-4" id = "cost-area">
                <img id='org-circle' src={ORANGE_CIRCLE}></img>
                <div id='cost-text'>${this.state.cost}</div>
              </div>
            </div>
            <div className = "row" id = "stepSection">
              {currentSteps}
            </div>
            <div className= "row" id = "submitMission">
              <Validation.components.Form onSubmit={this.handleSubmit}>
                <input id="create-mission-btn" type="submit" value="Create Mission"/>
              </Validation.components.Form>
            </div>
            <AddStep enable = {this.state.popup}
                addStep = {this.addStep} hidePopup={this.hidePopup}/>
            <ConfirmMission enable = {this.state.confirmMission}
                toBeConfirmed = {this.state.newMission} finalSubmit = {this.finalSubmit} hideConfirm={this.hideConfirm} steps = {this.state.newMissionSteps}/>
          </div>
        )
      } else if (this.props.path=="missionDetails"){
        //get currentMisssion info from given ID
        var currentMissionDetails = this.state.currentMissionDetails;
        if (currentMissionDetails == null){
          for (l=0;l<this.state.missions.length;l++){
            if (this.state.missions[l].id==this.props.queryParams.id){
              this.setState({currentMissionDetails:this.state.missions[l]});
              currentMissionDetails=this.state.missions[l];
              break;
            }
          }
        }
        var missionSteps = this.state.currentMissionSteps;
        if (missionSteps==null){
          missionSteps = new Array();
          var self=this
          for (j=0;j<currentMissionDetails.steps.length;j++){
            Meteor.call('getStep',currentMissionDetails.steps[j],function(err,res){
              missionSteps.push(
                <div id="step-actual-info">
                <div className="col-xs-4">
                  <img id="step-icon-mini" src={icon_links[res.data.type]}></img>
                </div>
                <div className="col-xs-8">
                  <div id="step-actual-name">
                  Task - {res.data.name}</div>
                  <div id="step-actual-desc">
                    {res.data.desc}
                  </div>
                </div>
              </div>);
              self.setState({currentMissionSteps:missionSteps});
            })
          }
        }


        return (<div>
                <div className = "container-fluid">
                  <div className="row" id = "topHeader">
                    <div className = "col-xs-8" id = "nameEditing">
                      <div id="mission-otw-name">
                      {currentMissionDetails.name} </div>
                      <div id="mission-otw-desc">
                        {currentMissionDetails.desc} </div>
                      <div id="mission-otw-desc">
                        {currentMissionDetails.address} </div>
                    </div>
                    <div className = "col-xs-4" id = "cost-area">
                      <img id='org-circle' src={ORANGE_CIRCLE}></img>
                      <div id='cost-text'>${currentMissionDetails.cost}</div>
                    </div>
                  </div>
                  <div className= "row" id="stepSection">
                    {missionSteps}
                  </div>
                </div>
                  <div id="submitMission">
                    <div onClick={()=>{this.startMission()}}
                     id="create-mission-btn">Start Mission</div>
                </div></div>)
      } else if (this.props.path == "missionCompleter"){
        return (<div className = "container-fluid"> <MissionCompleter userID = {this.state.currUserID} missionDetails={this.state.currentMissionDetails}/></div>)
      } else {
        return (<div>404</div>)
      }
    }
}

export default App;
