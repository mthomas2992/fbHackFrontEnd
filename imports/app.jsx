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


import MissionAnalytics from '/imports/missionAnalytics.jsx';

import {geolocated} from 'react-geolocated';

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
        profiles: null,
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
        currentMissionSteps:null,
        login_email:"",
        login_password:"",
        reg_email:"",
        reg_password:"",
        reg_first_name:"",
        reg_last_name:"",
        not_failed:true
      }

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.addStep = this.addStep.bind(this);
      this.makePopup = this.makePopup.bind(this);
      this.hidePopup=this.hidePopup.bind(this);
      this.finalSubmit = this.finalSubmit.bind(this);
      this.loadMissions = this.loadMissions.bind(this);
      this.hideConfirm = this.hideConfirm.bind(this);

      this.submitLoginForm = this.submitLoginForm.bind(this);
      this.submitRegisterForm = this.submitRegisterForm.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      this.handleChangeMaps = this.handleChangeMaps.bind(this);
      this.startMission = this.startMission.bind(this);

      this.goToProfile = this.goToProfile.bind(this);
    };

    componentWillMount(){
      this.loadMissions();
      this.loadProfiles();
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

    loadProfiles(){
        var self = this;
        Meteor.call('getProfiles', function (err,res) {
            self.setState({profiles:res});
        })
    }

    getProfiles(){
        return this.state.profiles;
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

    goToProfile(){
      FlowRouter.go('/profile');
    }

    submitLoginForm(event) {
        event.preventDefault();
        console.log(event);

        const login_email = ReactDOM.findDOMNode(this.refs.login_email).value.trim();
        const login_password = ReactDOM.findDOMNode(this.refs.login_password).value.trim();

        console.log(login_email);
        console.log(login_password);

        var self = this;

        Meteor.call('isValidLogin', login_email, login_password, function (err,res){
          if (res) {
              self.setState({not_failed:true});
              FlowRouter.go('/home');
          } else {
              self.setState({not_failed:false});
          }
        })

        ReactDOM.findDOMNode(this.refs.login_email).value = '';
        ReactDOM.findDOMNode(this.refs.login_password).value = '';
    }

    submitRegisterForm(event) {
        event.preventDefault();
        console.log(event);

        console.log("processing registration");
        const reg_email = ReactDOM.findDOMNode(this.refs.reg_email).value.trim();
        const reg_password = ReactDOM.findDOMNode(this.refs.reg_password).value.trim();
        const reg_first_name = ReactDOM.findDOMNode(this.refs.reg_first_name).value.trim();
        const reg_last_name = ReactDOM.findDOMNode(this.refs.reg_last_name).value.trim();

        var self = this;

        Meteor.call('createProfile', reg_email, reg_password, reg_first_name, reg_last_name, function (err,res){
            self.setState({not_failed:true});
            FlowRouter.go('/home');
        // TODO: Handle 400s for profile creation
        //   if (res) {
        //       self.setState({not_failed:true});
        //       FlowRouter.go('/home');
        //   } else {
        //       self.setState({not_failed:false});
        //   }
        })

        ReactDOM.findDOMNode(this.refs.reg_email).value = '';
        ReactDOM.findDOMNode(this.refs.reg_password).value = '';
        ReactDOM.findDOMNode(this.refs.reg_first_name).value = '';
        ReactDOM.findDOMNode(this.refs.reg_last_name).value = '';
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

    getCompletedMissions() {
        if (this.state.profiles) {
            var compMissArr = this.state.profiles.filter((obj) => {
                return obj.email === this.state.login_email;
            });
            if (compMissArr.length > 0) {
                compMissArr = compMissArr[0].completed_missions;
            } else {
                return [];
            }
            console.log(compMissArr);

            retArr = []
            console.log(this.state.missions);

            var match;
            for (i = 0; i < compMissArr.length; i++) {
                match = this.state.missions.filter((obj) => {
                    return obj.id == compMissArr[i];
                })
                if (match.length > 0)
                    retArr.push(match[0])
            }
            console.log(retArr);
            return retArr;
        }
    }

    render() {
      const AutocompleteItem = ({ formattedSuggestion }) => (
        <div className="Demo__suggestion-item">
          <i className='fa fa-map-marker Demo__suggestion-icon'/>
          <strong>{formattedSuggestion.mainText}</strong>{' '}
          <small className="text-muted">{formattedSuggestion.secondaryText}</small>
        </div>);

      if (this.state.missions==null || this.props.coords==null){
        return (<div>loading....</div>)
      } else if (this.props.path == "landing") {
          return (
          <div className="container-fluid" id="landing-page">
            <div className="row">
               <h1>Welcome</h1>
               <h3 hidden={this.state.not_failed}>Login Failed</h3>
                <form onSubmit={this.submitLoginForm}>
                    <h2>Email</h2>
                    <input type="text" ref="login_email"/>
                    <h2>Password</h2>
                    <input type="password" ref="login_password"/>
                    <br/>
                    <input type="submit" value="Login!"/>
                </form>
                <a href="/register">No account? Register here</a>
            </div>
          </div>
          );
      } else if (this.props.path == "register") {
          return (
              <div className="container-fluid" id="register-page">
                <div className="row">
                   <h1>Register Here</h1>
                    <form onSubmit={this.submitRegisterForm}>
                        <h2>Email</h2>
                        <input type="text" ref="reg_email"/>
                        <h2>Password</h2>
                        <input type="password" ref="reg_password"/>
                        <h2>First Name</h2>
                        <input type="text" ref="reg_first_name"/>
                        <h2>Last Name</h2>
                        <input type="text" ref="reg_last_name"/>
                        <br/>
                        <input type="submit" value="Register!"/>
                    </form>
                    <a href="/">Got an account? Login here</a>
                </div>
              </div>
          );
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

          console.log(this.props);
        return (<div className="container-fluid">
                    <div className = "row" id ="mainMap">
                      <GoogleMapReact
                        center={[this.props.coords.latitude, this.props.coords.longitude]}
                        zoom={15}
                      >
                      <Location type={5} lat={this.props.coords.latitude} lng = {this.props.coords.longitude}/>
                      {currLocations}
                      </GoogleMapReact>
                    </div>
                    <div className = "row" id = "carousel">
                      <Carousel decorators={Decorators}
                        afterSlide={this.afterSlide}>
                        {carouselElements}
                      </Carousel>
                    </div>
                    <div onClick={()=>{this.goToProfile()}} id="myProfile">
                      <img id="myProfileImgSrc" src="https://www.book2trip.com/template/website/img/profile.png"></img>
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
              console.log(res);
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
    } else if (this.props.path == "profile") {

      var completedMissions = this.getCompletedMissions();

      var missionDivs = new Array();
      for (i = 0; i < completedMissions.length; i++)
          missionDivs.push(
              <div className="profile-comp-missions">
                  <div>
                      <p><b>{completedMissions[i].desc}</b></p>
                      <p>{completedMissions[i].name}</p>
                  </div>
              </div>
          );

      var profile = this.getProfiles().filter((obj) => {
          return obj.email === this.state.login_email;
      });

      var currentMissionArr = this.state.missions.filter((obj) => {
          return obj.id === profile.current_mission;
      }) || [];

      var hideCurrent = true;
      var currentMission;
      if (currentMissionArr.length > 0) {
          hideCurrent = false;
          currentMission = currentMissionArr[0];
      }

      var cm_name = (currentMission && currentMission.name) || "";
      var cm_desc = (currentMission && currentMission.desc) || "";

      return (
          <div className="container-fluid" id="profile-page">
            <div className="row" id="top-header">
              <div id="left-col">
                  <img className="img-circle" src="http://blogs.timesofindia.indiatimes.com/wp-content/uploads/2015/12/mark-zuckerberg.jpg"/>
                  <p>{profile.first_name} {profile.last_name}</p>
              </div>
              <div id="right-col">
                  <h1>${profile.amount}</h1>
                  <button>Edit Info</button>
              </div>
            </div>
            <div className="row" id="body-div">
              <div id="current-mission" hidden={hideCurrent}>
                  <div>
                      <h3>Your Offered Mission</h3>
                      <p><b>{cm_name}</b></p>
                      <p>{cm_desc}</p>
                  </div>
              </div>

              {missionDivs}

            </div>
          </div>
      );
      } else {
        return (<div>404</div>)
      }
    }
}

// export default App;


export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000
})(App);
