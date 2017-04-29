import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.methods ({
    'getAddressFromLatLng' : function(lat,lng) {
      var queryString = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyAWG2Klg1bfrz8DrWhB9L5Vz2lAVQHyr3o";
      var result = HTTP.get(queryString);
      var formatted =JSON.parse(result.content);
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
      var queryString = "https://fbht17.herokuapp.com/missions";
      var result = HTTP.get(queryString);
      //console.log(result);

      // for(i=0; i< result.data.length; i++) {
      //   var lat = result.data[i].lat;
      //   var lng = result.data[i].long;
      //   result.data[i]['address'] = Meteor.call('getAddressFromLatLng',{lat},{lng})
      // }


      return result.data;
    },

    'getMission' : function(id) {
      var queryString = "https://fbht17.herokuapp.com/missions/"+id;
      var result = HTTP.get(queryString);
      return result.data;
    },

    'getResultsData' :function(resultsToGet){
      var toReturn = new Array();
      for (i=0;i<resultsToGet.length;i++){
        var queryString="https://fbht17.herokuapp.com/results/"+resultsToGet[i];
        var secondQueryString = "https://fbht17.herokuapp.com/steps/"+resultsToGet[i];
        var result = HTTP.get(queryString);
        var secondResult = HTTP.get(secondQueryString);
        result.data["stepInfo"]=secondResult.data;
        toReturn.push(result.data);
      }
      return toReturn;
    },

    'createNewMission' :function(name,lat,lng,author,desc,cost,numUsers){
      var queryString="https://fbht17.herokuapp.com/missions/";
      var result = HTTP.post(queryString,{
        params: {
           "name":name,
           "lat":lat,
           "long": lng,
           "author": author,
           "cost":cost,
           "desc":desc,
           "num_users":numUsers,
         }});
      return(result);
    },

    'createSteps' : function(steps,missionID){
      //console.log(missionID);
      for (i=0;i<steps.length;i++){
        var queryString = "https://fbht17.herokuapp.com/steps/";
        var result = HTTP.post(queryString,{params:{
          "type":steps[i].type,
          "desc":steps[i].desc,
          "cost":steps[i].cost,
          "name":steps[i].name,
          "mission":missionID
        }});
        //console.log(result);
      }

    },

    'getSteps' :function() {
      var queryString = "https://fbht17.herokuapp.com/steps/";
      var result = HTTP.get(queryString);
      //console.log(result);
      return result.data;
    },

    'getResults' :function() {
        var queryString = "https://fbht17.herokuapp.com/results/";
        var result = HTTP.get(queryString);
        return result.data;
    },

    'createResult' :function(profile_id, step_id, content) {
        var queryString = "https://fbht17.herokuapp.com/results/";
        var result = HTTP.post(queryString,{
          params: {
             "profile": profile_id,
             "step": step_id,
             "content": content
           }});
        return(result);
    },

    'resultIsSuccess' :function(result) {
        if (result.statusCode >= 200 && result.statusCode < 300)
            return true;
        return false;
    },

    'getProfiles' :function() {
        var queryString = "https://fbht17.herokuapp.com/profiles/";
        var result = HTTP.get(queryString);
        return result.data;
    },

    'createProfile' :function(email, password, first_name, last_name) {
        var queryString = "https://fbht17.herokuapp.com/profiles/";
        var result = HTTP.post(queryString, {
            params: {
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
                "current_mission": null,
                "amount": 0.0
            }});
        return result;
    },

    'isValidLogin' :function(email, password) {
        var queryString = "https://fbht17.herokuapp.com/login/";
        var result = HTTP.post(queryString, {
            params: {
                "email": email,
                "password": password
            }});
        if (result.statusCode == 200)
            return true;
        return false;
    },

    'getImageUrl' :function(base64EncodedImage) {
        var queryString = "https://fbht17.herokuapp.com/upload/";
        var result = HTTP.post(queryString, {
            params: {
                "image": base64EncodedImage
            }});
        return result.data.image;
    },

    'getStep':function(id){
      var queryString= "https://fbht17.herokuapp.com/steps/"+id;
      var result = HTTP.get(queryString);
      return result;
    }

  });
});
