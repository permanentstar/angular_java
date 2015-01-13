/**
 * Created by StarWolf on 2015/1/12.
 */
'use strict';
angular.module("app.services")
    .factory("User",function($resource){
        return $resource("rest/user/:userId",
            {userId:'@id'},
            {isValid:{method:'GET',params:{login:false},isArray:false}});
    })
;
