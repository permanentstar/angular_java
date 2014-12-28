'use strict';

/* App Module */

var singeletonApp = angular.module('singeletonApp', ['http-auth-interceptor',
    'ngResource', 'ngRoute', 'ngCookies', 'singeletonAppUtils', 'truncate', 'ngCacheBuster']);

singeletonApp
    .config(function ($routeProvider, $httpProvider, httpRequestInterceptorCacheBusterProvider, USER_ROLES) {

            //Cache everything except rest api requests
            httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*rest.*/],true);//默认black=false  白名单为不刷新缓存的 黑名单则为需要刷新缓存的

            $httpProvider.responseInterceptors.push('securityInterceptor');

            $routeProvider
                .when('/register', {
                    templateUrl: 'views/register.html',
                    controller: 'RegisterController',
                    access: [USER_ROLES.all],
                    resolve: {
                        auth: ["$q", "AuthService", function($q, AuthService) {
                            return $q.when(AuthService.isAuthorized([USER_ROLES.all]));
                        }]
                    }
                })
                .when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'LoginController',
                    access: [USER_ROLES.all]
                })
                .when('/error', {
                    templateUrl: 'views/error.html',
                    access: [USER_ROLES.all]
                })
                .when('/unauthorized', {
                    templateUrl: 'views/error.html',
                    access: [USER_ROLES.all]
                })
                .otherwise({
                    templateUrl: 'views/main.html',
                    controller: 'MainController',
                    access: [USER_ROLES.all]
                });

            // Initialize angular-translate
        })
        .provider('securityInterceptor', function() {
            this.$get = function($location, $q) {
                return function(promise) {
                    return promise.then(null, function(response) {
                        if(response.status === 403 || response.status === 401) {//todo 未登录 无权限区分对待
                            $location.path('/unauthorized');
                        }
                        return $q.reject(response);
                    });
                };
            };
        })
        .run(function($rootScope, $location, $http, Session, USER_ROLES) {
                $rootScope.userRoles = USER_ROLES;
                $rootScope.$on('$routeChangeStart', function (event, next) {
                    if(!Session.login){//未登陆
                        Session.invalidate();
                        $location.path('/login');
                    }else if(!AuthenticationSharedService.isAuthorized(next.access)){
                        $location.path('/unauthorized');
                    }
                });

                $rootScope.$on("$routeChangeError", function(event, current, previous, eventObj) {
                    if (eventObj.authenticated === false) {
                        $location.path("/login");
                    }
                });

                // Call when the 401 response is returned by the server  后台返回未登录
                $rootScope.$on('event:auth-loginRequired', function(rejection) {
                    Session.invalidate();
                    $location.path('/login');
                });

                // Call when the 403 response is returned by the server  比如绕过前台验证访问后台得到无权限
                $rootScope.$on('event:auth-notAuthorized', function(rejection) {
                    $rootScope.errorMessage = 'errors.403';
                    $location.path('/unauthorized');
                });

                // Call when the user logs out
                $rootScope.$on('event:auth-loginCancelled', function() {
                    $location.path('');
                });
        })
    ;
