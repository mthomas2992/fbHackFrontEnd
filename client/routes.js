import React from 'react';
import ReactDOM from 'react-dom';
import App from '/imports/app.jsx';

FlowRouter.route('/', {
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
