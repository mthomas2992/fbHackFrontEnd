import React from 'react';
import validator from 'validator';
import Validation from 'react-validation';

Object.assign(Validation.rules, {

    required: {
        rule: value => value.toString().trim(),
        hint: () => <div id="errorCode">Required</div>
    },

    email: {
        rule: value => validator.isEmail(value),
        hint: value => <div id="errorCode">{value} is not an Email.</div>
    },

    phone: {
      rule: value => {
          var regex = new RegExp('04[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]');
          var matches = regex.exec(value);
          if (matches == null || value.length!=10){
            return false;
          } else {
            return true;
          }
        },
      hint: value => <div id="errorCode">{value} is not a valid phone number (e.g 0412345678)</div>
  },

    alpha: {
        rule: value => validator.isAlpha(value),
        hint: () => (
            <div id="errorCode">
                String should contain only letters (a-zA-Z).
            </div>
        )
    }
});
