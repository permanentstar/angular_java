'use strict';

/* App Module */
angular.module("app.directives", []);
angular.module("app.services", ['ui.bootstrap']);/*ui bootstrap 用于模态框*/
angular.module("app.filters", []);
angular.module('app.utils', []);
var app = angular.module('app', ['ngResource', 'ngRoute', 'ngCookies', "app.services", "app.filters", "app.utils", "app.directives", 'ngCacheBuster']);

app.config(function ($routeProvider, $httpProvider, httpRequestInterceptorCacheBusterProvider, USER_ROLES, CONTENT_TYPE) {

    //Cache everything except rest api requests
    //httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*rest.*/],true);//默认black=false  白名单为不刷新缓存的 黑名单则为需要刷新缓存的

    $httpProvider.responseInterceptors.push('securityInterceptor');

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

    $httpProvider.defaults.transformRequest = function (data, headersGetter) {     //transformRequest默认为array transformRequest[0]为将object $.params=>url encoded 此处直接替换为stringify
        var header = headersGetter();
        var contentType = header['Content-Type'];
        var rtData;
        if (contentType == CONTENT_TYPE.form) {//form url encoded
            rtData = json2FormParams(data);
        } else {//json request
            if (typeof data === 'string') {
                rtData = data;
            } else {
                rtData = JSON.stringify(data);
            }
        }
        return rtData;
    };
    var json2FormParams = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += json2FormParams(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '.' + subName;
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += json2FormParams(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };
})
    .provider('securityInterceptor', function () {
        this.$get = function ($location, $q) {
            return function (promise) {
                return promise.then(null, function (response) {
                    if (response.status === 403 || response.status === 401) {//todo 未登录 无权限区分对待
                        $location.path('/unauthorized');
                    }
                    return $q.reject(response);
                });
            };
        };
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
