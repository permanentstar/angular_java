'use strict';
/* Services */
angular.module("app.services")
    .factory('Session', function () {
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
    })
    .factory('Account', function ($resource) {
        return $resource('app/rest/account', {}, {});
    })
    .factory('AuthService', function ($rootScope, $http,$q, Session, Account) {
        return {
            login:function(){

            },
            promiseAuthor:function(roles){
                return this.isAuthorized(roles) ? $q.when(true):$q.reject({authenticated:false})
            },
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
                $rootScope.$broadcast('event:auth-loginCancelled');
            }
        };
    })
    .factory('ModalWinService',['$modal',function($modal){
        return {
            modalWin:modalWin
        };
        function modalWin(templateUrl,controller,winClazz,input,callback){
            var modalInstance = $modal.open({
                templateUrl: templateUrl,
                controller: controller,
                windowClass:winClazz,
                resolve: input
            });
            modalInstance.result.then(function (result) {//receive promise result from ModalInstanceCtrl 'OK'
                if(callback){
                    callback(result);
                }
            }, function () {//receive promise result from ModalInstanceCtrl 'Cancel'
                //$log.info('Modal dismissed at: ' + new Date());
            });
        }
    }])
    .factory('Validator',function(){
        var ipRegex = /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/;
        return {
            ipValidate:ipValidate,
            numberValidate:numberValidate
        };
        function ipValidate(ipStr){
            if(typeof ipStr == 'string' && ipStr.trim() != ''){
                var ip = ipStr.split('/')[0];
                if(ip != '0.0.0.0'){
                    if(ipRegex.test(ip)){
                        return true;
                    }
                }
            }
            return false;
        }
        function numberValidate(num,min,max){
            if(num == null){
                return false;
            }
            var valid = !isNaN(num);
            if(min && !isNaN(min)){
                valid = valid && (num >= min);
            }
            if(max && !isNaN(max)){
                valid = valid && (num <= max);
            }
            return valid;
        }
    })
;
