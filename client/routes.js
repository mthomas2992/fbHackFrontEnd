import React from 'react';
import ReactDOM from 'react-dom';
import App from '/imports/app.jsx';

FlowRouter.route('/', {
  action(params, queryParams) {
    ReactDOM.render(<App path="landing"/>, document.getElementById('app'));
  }
});

FlowRouter.route('/login', {
  action(params, queryParams) {
    ReactDOM.render(<App path="login"/>, document.getElementById('app'));
  }
});

FlowRouter.route('/register', {
  action(params, queryParams) {
    ReactDOM.render(<App path="register"/>, document.getElementById('app'));
  }
});

FlowRouter.route('/home', {
  action(params, queryParams) {
    ReactDOM.render(<App path="home"/>, document.getElementById('app'));
  }
});

FlowRouter.route('/missionCreator', {
  action(params, queryParams) {
    ReactDOM.render(<App path="missionCreator"/>, document.getElementById('app'));
  }
});

FlowRouter.route('/missionDetails', {
  action(params, queryParams) {
    ReactDOM.render(<App path="missionDetails" queryParams={queryParams}/>, document.getElementById('app'));
  }
});

FlowRouter.route('/missionCompleter', {
  action(params, queryParams) {
    ReactDOM.render(<App path="missionCompleter" />, document.getElementById('app'));
  }
});
