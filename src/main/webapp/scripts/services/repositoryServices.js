/**
 * Created by StarWolf on 2015/1/12.
 */
'use strict';
angular.module("app.services")
.factory("Users",function(Restangular){
    return Restangular.service(ctx+"/rest/users")
    });
