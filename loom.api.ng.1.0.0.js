'use strict';

angular.module('loom.api',[])
  .factory('loomApi', ['$resource', function ($resource) {
    
    var service = {};

    //config
    var loomApiServer = null;
    service.Config = {};
    service.Config.init = function(configObj) {
      service.Config.protocol = configObj.protocol ? configObj.protocol : "http";
      service.Config.hostname = configObj.hostname ? configObj.hostname : "localhost";
      service.Config.port = configObj.port ? configObj.port : "9000";

      loomApiServer = service.Config.protocol 
                    + "://" 
                    + service.Config.hostname 
                    + ":" 
                    + service.Config.port;
    }
    service.Config.init({});

    //Article Service
    service.Article = {};
    service.Article.getArticle = function(id) {
      var r=$resource(loomApiServer + '/api/articles/getarticle/:id', {},
                      {
                          getArticle: { method: 'GET', params: { id: id }}
                      });

      return r.getArticle({id: id}).$promise.then(function(data) {
        return data;
      });
    };

    service.Article.saveArticle = function(model) {
      console.log(model);
      var r=$resource(loomApiServer + '/api/articles/saveArticle', {},
                      {
                          saveArticle: { method: 'POST', params: {}}
                      });

      return r.saveArticle(model).$promise.then(function(data) {
        return data; 
      });
    };

    service.Article.listAllMyArticles = function() {
      var r=$resource(loomApiServer + '/api/articles/listMyArticles', {}, 
                      {
                          listAllMyArticles: {method: 'GET', isArray: true, params: {getAllData: false}}
                      });
      return r.listAllMyArticles().$promise.then(function(data){
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

    service.Article.updateArticle = function(docData) {
      var r=$resource(loomApiServer + '/api/articles/updateArticle', {},
                      {
                          updateArticle: { method: 'Post', params: { updateData: docData }}
                      });

      return r.updateArticle({updateData: docData}).$promise.then(function(data) {
        return data;
      });
    };

    //User Service
    service.User = {};
    service.User.signInUser = function(username, password){
      var r=$resource(loomApiServer + '/api/users/signin', {},
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

    service.User.getUser = function(userid) {
      var r=$resource(loomApiServer + '/api/users/getuser/:username', {},
                      {
                          getUser: { method: 'GET', params: {username: '' }}
                      });

      return r.getUser({username: userid}).$promise.then(function(data) {
        return new User(data);
      });
    };

    return service;

  }]);
