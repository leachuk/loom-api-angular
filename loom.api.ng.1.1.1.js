'use strict';

//todo: will require an api implementation per client to handle unique endpoints to the application

angular.module('loom.api',[])
  .factory('loomApi', ['$resource', function ($resource) {

    var initAuth = function(authObj) {
      return "Bearer " + authObj;
    };

    //Config    
    var loomApiServer = null;
    var service = {
      protocol : "http",
      hostname : "localhost",
      port : "9000"
    };

    service.init = function(configObj) {
      if(Object.keys(configObj).length !== 0){
        for(var prop in arguments[0]){
          if(service.hasOwnProperty(prop)){
              service[prop]=arguments[0][prop];   
          }
        }
      }

      if(service.port == "80" || service.port == ""){
        loomApiServer = service.protocol
          + "://"
          + service.hostname;
      } else {
        loomApiServer = service.protocol
          + "://"
          + service.hostname
          + ":"
          + service.port;
      }

    }
    service.init({});

    //Article Service
    service.Article = {};
    service.Article.getArticle = function(id, auth) {
      var r=$resource(loomApiServer + '/api/recruitunit/articles/getarticle/:id', {},
                      {
                          getArticle: { method: 'GET', params: { id: id }, headers: {'Authorization': initAuth(auth)}}
                      });

      return r.getArticle({ id: id }).$promise.then(function(data) {
        return data;
      });
    };

    service.Article.createArticle = function(modelData, modelId, modelType, auth) {
      var r=$resource(loomApiServer + '/api/articles/createArticle', {},
                      {
                          createArticle: { method: 'PUT', params: {modelId: modelId, modelType: modelType}, headers: {'Authorization': initAuth(auth)}}
                      });

      return r.createArticle(modelData).$promise.then(function(data) {
        return data; 
      });
    };

    service.Article.listAllMyArticles = function(modelId, auth) {
      var r=$resource(loomApiServer + '/api/articles/listMyArticles', {}, 
                      {
                          listAllMyArticles: { method: 'GET', isArray: true, params: { modelId: modelId, getAllData: false }, headers: {'Authorization': initAuth(auth)}}
                      });

      return r.listAllMyArticles().$promise.then(function(data){
        return data;
      });
    };


    //RecruitUnit specific endpoint
    service.Article.listMyTestContent = function(modelId, comparisonRulesDocId, auth) {
      var r=$resource(loomApiServer + '/api/articles/listMyTestContent', {},
          {
              listMyTestContent: { method: 'GET', isArray: true, params: { modelId: modelId, comparisonRulesDocId: comparisonRulesDocId, getAllData: true }, headers: {'Authorization': initAuth(auth)}}
          });

      return r.listMyTestContent().$promise.then(function(data){
          return data;
      });
    };

    //RecruitUnit specific endpoint
    service.Article.getUserTestResults = function(searchJson, auth) {
      var r=$resource(loomApiServer + '/api/recruitunit/articles/getUserTestResults', {},
          {
              getUserTestResults: { method: 'GET', isArray: true, params: { searchJson: searchJson, getAllData: true }, headers: {'Authorization': initAuth(auth)}}
          });

      return r.getUserTestResults().$promise.then(function(data){
          return data;
      });
    };

    service.Article.delete = function(id, rev) {
      console.log("delete, id:" + id + ", rev:" + rev);
      var r=$resource(loomApiServer + '/api/articles/deleteArticle', {}, 
                      {
                          deleteArticle: {method: 'POST', params: { id: id, rev: rev}}
                      });

      return r.deleteArticle().$promise.then(function(data){
        return data;
      });
    };

    service.Article.updateArticle = function(docId, modelId, modelType, docData, authToken) {
      var r=$resource(loomApiServer + '/api/articles/updateArticle/:id', {},
                      {
                          updateArticle: { method: 'Post', params: { id: docId, updateData: docData, modelId: modelId, modelType: modelType }, headers: {'Authorization': initAuth(authToken)}}
                      });

      return r.updateArticle({ id: docId, updateData: docData}).$promise.then(function(data) { //todo: is the json required here? Remove from all if not
        return data;
      });
    };

    service.Article.compare = function(sourceid, compareid, authToken) {
      var r=$resource(loomApiServer + '/api/articles/compare/:sourceid/:compareid', {},
          {
              compare: { method: 'GET', isArray: true, params: { sourceid: '', compareid: '' }, headers: {'Authorization': initAuth(authToken)}}
          });

      return r.compare({ sourceid: sourceid, compareid: compareid }).$promise.then(function(data) {
          return data;
      });
    };

    service.Article.search = function(modelId, modelType, searchJson, auth) {
      var r=$resource(loomApiServer + '/api/articles/search', {},
          {
              search: { method: 'GET', isArray: true, params: { modelId: modelId, modelType: modelType, searchJson: searchJson, getAllData: true }, headers: {'Authorization': initAuth(auth)}}
          });

      return r.search().$promise.then(function(data){
          return data;
      });
    };

    //recruitunit specific
    service.Article.createJobSubmission = function(modelData, auth) {
      var r=$resource(loomApiServer + '/api/recruitunit/articles/createjobsubmission', {},
          {
              createJobSubmission: { method: 'PUT', params: {}, headers: {'Authorization': initAuth(auth)}}
          });

      return r.createJobSubmission(modelData).$promise.then(function(data) {
          return data;
      });
    };

    //recruitunit specific
    service.Article.toggleDevEmailDisplay = function(docId, authToken) {
      var r=$resource(loomApiServer + '/api/recruitunit/articles/toggledevemaildisplay', {},
          {
              updateArticle: { method: 'Post', params: { id: docId }, headers: {'Authorization': initAuth(authToken)}}
          });

      return r.updateArticle({ id: docId }).$promise.then(function(data) {
          return data;
      });
    };

		service.Article.find = function(selectorJson, authToken) {
			var r=$resource(loomApiServer + '/api/recruitunit/articles/find', {},
				{
					find: { method: 'POST', headers: {'Authorization': initAuth(authToken)}}
				});

			return r.find(selectorJson).$promise.then(function(data) {
				return data;
			});
		};

    //User Service
    service.User = {};

    service.User.createNewUser = function(modelData, modelId){
      var r=$resource(loomApiServer + '/api/users/signup', {},
                      {
                          createNewUser: { method: 'Post', params: {'modelId': modelId }, headers: {} }
                      });

      return r.createNewUser(modelData).$promise.then(
        function(data) {
          return data;
        });
    };

    service.User.signInUser = function(username, password){
      var r=$resource(loomApiServer + '/api/recruitunit/users/signin', {},
                      {
                          signInUser: { method: 'Post', params: {username: username, password: password }}
                      });

      return r.signInUser({username: username, password: password }).$promise.then(
        function(success) {
          return success;
        },
        function(error){
          return error;
        });
    };

    service.User.getUser = function(userid, authToken) {
      var r=$resource(loomApiServer + '/api/users/getuser/:username', {},
        {
          getUser: { method: 'GET', params: {username: '' }, headers: {'Authorization': initAuth(authToken)}}
        });

      return r.getUser({username: userid}).$promise.then(function(data) {
        return data;
      });
    };

    service.User.getSpecifiedUser = function(userid, authToken) {
      var r=$resource(loomApiServer + '/api/users/getspecifieduser/:username', {},
        {
          getUser: { method: 'GET', params: {username: '' }, headers: {'Authorization': initAuth(authToken)}}
        });

      return r.getUser({username: userid}).$promise.then(function(data) {
        return data;
      });
    };

    //recruitunit specific
    service.User.getUserFromGuid = function(userguid, authToken) {
      var r=$resource(loomApiServer + '/api/recruitunit/users/getuserdetails/:userguid', {},
          {
              getUserFromGuid: { method: 'GET', params: {userguid: '' }, headers: {'Authorization': initAuth(authToken)}}
          });

      return r.getUserFromGuid({userguid: userguid}).$promise.then(function(data) {
          return data;
      });
    };

    //recruitunit specific
    service.User.updateUser = function(useremail, updateJson, authToken) {
      var r=$resource(loomApiServer + '/api/recruitunit/users/updateuser/:useremail', {},
          {
              updateUser: { method: 'POST', params: { useremail: useremail}, headers: {'Authorization': initAuth(authToken)}}
          });

      return r.updateUser({ updateJson: updateJson }).$promise.then(function(data) {
          return data;
      });
    };

    //recruitunit specific
    service.User.getDevEmailFromDocId = function(docid, authToken) {
      var r=$resource(loomApiServer + '/api/recruitunit/users/getdevemailfromdocid/:docid', {},
          {
              getDevEmailFromDocId: { method: 'GET', params: {docid: docid }, headers: {'Authorization': initAuth(authToken)}}
          });

      return r.getDevEmailFromDocId({docid: docid}).$promise.then(function(data) {
          return data;
      });
    };

    return service;

  }]);
