'use strict';

/* App Module */
angular.module("app.directives", []);
angular.module("app.services", ['ui.bootstrap']);
angular.module("app.filters", []);
angular.module('app.utils', []);
var app = angular.module('app', ['ngResource', 'ngRoute', 'ngCookies', "app.services", "app.filters", "app.utils", "app.directives", 'ngCacheBuster']);

app.config(function ($provide,$routeProvider, $httpProvider, httpRequestInterceptorCacheBusterProvider, USER_ROLES) {

    //Cache everything except rest api requests 默认black=false matchlist=[[/.*partials.*/, /.*views.*/ ]  白名单为不刷新缓存的 黑名单则为需要刷新缓存的
    //本应用router view在 views/下 directive的template在partials/下 因此无需设置
    //httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*partials.*/,/.*views.*/],false);
    $httpProvider.interceptors.push(function($q) {
        return {
            /*'request': function(config) {
                return config;
            },*/
            'response': function(response) {
                if(response.data instanceof Array){
                    var header = response.headers();
                    if(header.total != null){
                        response.data.total = header.total;
                    }
                }
                return response;
            },
           /* 'requestError': function(rejection) {
                return $q.reject(rejection.statusText);
            },*/
            'responseError': function(rejection) {
                if (rejection.status === 403 || rejection.status === 401) {//todo 未登录 无权限区分对待
                    $location.path('/unauthorized');
                }
                return $q.reject(rejection.statusText);
            }
        };
    });

    $routeProvider
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController',
            resolve: {
                auth: ["AuthService", function (AuthService) {
                    return AuthService.promiseAuthor([USER_ROLES.all]);
                }]
            }
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController',
            resolve: {
                auth: ["AuthService", function (AuthService) {
                    return AuthService.promiseAuthor([USER_ROLES.all]);
                }]
            }
        })
        .when('/error', {
            templateUrl: 'views/error.html',
            resolve: {
                auth: ["AuthService", function (AuthService) {
                    return AuthService.promiseAuthor([USER_ROLES.admin, USER_ROLES.user]);
                }]
            }
        })
        .when('/unauthorized', {
            templateUrl: 'views/error.html',
            resolve: {
                auth: ["AuthService", function (AuthService) {
                    return AuthService.promiseAuthor([USER_ROLES.all]);
                }]
            }
        })
        .otherwise({
            templateUrl: 'views/main.html',
            controller: 'MainController',
            resolve: {
                auth: ["AuthService", function (AuthService) {
                    return AuthService.promiseAuthor([USER_ROLES.all]);
                }]
            }
        });

})
    .run(function ($rootScope, $location, $http, Session, USER_ROLES) {
        $rootScope.userRoles = USER_ROLES;

        $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
            if (eventObj.authenticated === false) {
                Session.invalidate();
                $location.path("/login");
            }
        });

        // Call when the 401 response is returned by the server  后台返回未登录
        $rootScope.$on('event:auth-loginRequired', function (rejection) {
            Session.invalidate();
            $location.path('/login');
        });

        // Call when the 403 response is returned by the server  比如绕过前台验证访问后台得到无权限
        $rootScope.$on('event:auth-notAuthorized', function (rejection) {
            $rootScope.errorMessage = 'errors.403';
            $location.path('/unauthorized');
        });

        // Call when the user logs out
        $rootScope.$on('event:auth-loginCancelled', function () {
            Session.invalidate();
            $location.path('/login');
        });
    });
