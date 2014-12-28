'use strict';

/* Services */

singeletonApp.factory('LanguageService', function ($http, $translate, LANGUAGES) {
        return {
            getBy: function(language) {
                if (language == undefined) {
                    language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
                }
                if (language == undefined) {
                    language = 'en';
                }

                var promise =  $http.get('i18n/' + language + '.json').then(function(response) {
                    return LANGUAGES;
                });
                return promise;
            }
        };
    });


singeletonApp.factory('Session', function () {
        this.create = function (login, firstName, lastName, email, userRoles) {
            this.login = login;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.userRoles = userRoles;
        };
        this.invalidate = function () {
            this.login = null;
            this.firstName = null;
            this.lastName = null;
            this.email = null;
            this.userRoles = null;
        };
        return this;
    });

singeletonApp.factory('Account', function ($resource) {
    return $resource('app/rest/account', {}, {
    });
});

singeletonApp.factory('AuthService', function ($rootScope, $http, Session, Account) {
        return {
            isAuthorized: function (authorizedRoles) {
                if(!Session.login){//前台未登陆 有可能前台权限未初始化 需要和后台同步一下
                    return Account.get().$promise.then(function(data) {
                        Session.create(data.login, data.firstName, data.lastName, data.email, data.roles);
                        $rootScope.account = Session;
                        //$rootScope.$broadcast('event:auth-loginConfirmed');
                        return this.hasPermission(authorizedRoles);
                    });
                }else{
                    return this.hasPermission(authorizedRoles);
                }
            },
            hasPermission:function(authorizedRoles){
                if (!angular.isArray(authorizedRoles)) {
                    if (authorizedRoles == '*') {
                        return true;
                    }

                    authorizedRoles = [authorizedRoles];
                }
                var isAuthorized = false;
                angular.forEach(authorizedRoles, function(authorizedRole) {
                    var authorized = (!!Session.login &&
                    Session.userRoles.indexOf(authorizedRole) !== -1);

                    if (authorized || authorizedRole == '*') {
                        isAuthorized = true;
                    }
                });

                return isAuthorized;
            },
            logout: function () {
                $rootScope.authenticationError = false;
                $rootScope.account = null;
                $http.get('app/logout');
                Session.invalidate();
                $rootScope.$broadcast('event:auth-loginCancelled');
            }
        };
    });
