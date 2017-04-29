import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.methods ({
    'getAddressFromLatLng' : function(lat,lng) {
      var queryString = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyAWG2Klg1bfrz8DrWhB9L5Vz2lAVQHyr3o";
      var result = HTTP.get(queryString);
      var formatted =JSON.parse(result.content)
      console.log(JSON.parse(result.content));
      return formatted.results[0].formatted_address;
    },
    //
    // 'getPlaceFromLatLng' : function(lat,lng) {
    //   var textSearch = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lng+"&radius=200&key=AIzaSyAWG2Klg1bfrz8DrWhB9L5Vz2lAVQHyr3o"
    //   var textRes = HTTP.get(textSearch);
    //
    //   var queryString = "https://maps.googleapis.com/maps/api/geocode/json?latlng=-33.8688,151.2093&key=AIzaSyAWG2Klg1bfrz8DrWhB9L5Vz2lAVQHyr3o";
    //   var result = HTTP.get(queryString);
    //   var formatted =JSON.parse(result.content)
    //   console.log(JSON.parse(result.content));
    //   return formatted.results[0].formatted_address;
    // },

    'getMissions' :function() {
      var queryString = "https://fbht17.herokuapp.com/missions/";
      var result = HTTP.get(queryString);
      //console.log(result);

      // for(i=0; i< result.data.length; i++) {
      //   var lat = result.data[i].lat;
      //   var lng = result.data[i].long;
      //   result.data[i]['address'] = Meteor.call('getAddressFromLatLng',{lat},{lng})
      // }


      return result.data;
    },

    'getSteps' :function() {
      var queryString = "https://fbht17.herokuapp.com/steps/";
      var result = HTTP.get(queryString);
      //console.log(result);
      return result.data;
    },

  });
});
