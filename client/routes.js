import React from 'react';
import ReactDOM from 'react-dom';
import App from '/imports/app.jsx';

FlowRouter.route('/', {
  action(params, queryParams) {
    ReactDOM.render(<App/>, document.getElementById('app'));
  }
});
