import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class Location extends React.Component {

    constructor(props){
      super(props);

    };


    render() {
      return (<div> TEST</div>)

    }
}

export default Location;


// <form onSubmit={this.handleSubmit}>
//   <h1>First if we could start with your name, phone number and address</h1>
//   <h2>Name:</h2>
//   <input ref={(input) => { this.id0 = input; }} id="formInput" name="name" type="text" value={this.state.name} onChange={this.handleChange} />
//   <h2>Phone:</h2>
//   <input id="formInput" name="phone" type="text" value={this.state.name} onChange={this.handleChange} />
//   <h2>Address:</h2>
//   <input id="formInput" name="name" type="text" value={this.state.name} onChange={this.handleChange} />
//
//
// </form>
