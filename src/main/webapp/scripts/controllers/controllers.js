'use strict';

/* Controllers */

app.controller('MainController', function ($scope,$resource) {
        $scope.btn_click = function(){
            $resource('/rest/user').query({page:1,pageCount:4},function(data,getResponseHeaders){
                //console.log([data,getResponseHeaders]);
                var header = getResponseHeaders();
                data.total = header.total;
                console.log([data,data.length]);
            });
        }
    })
    .controller("MenuController",function(){})
    .controller('LoginController', function ($scope, AuthService) {
        $scope.rememberMe = true;
        $scope.login = function () {
            alert("try login");
        }
    })
    .controller('RegisterController', function ($scope, Register) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.register = function () {
            if ($scope.registerAccount.password != $scope.confirmPassword) {
                $scope.doNotMatch = "ERROR";
            } else {
                $scope.doNotMatch = null;
                $scope.success = null;
                $scope.error = null;
                $scope.errorUserExists = null;
                $scope.errorEmailExists = null;
                Register.save($scope.registerAccount,
                    function (value, responseHeaders) {
                        $scope.success = 'OK';
                    },
                    function (httpResponse) {
                        if (httpResponse.status === 400 && httpResponse.data === "login already in use") {
                            $scope.error = null;
                            $scope.errorUserExists = "ERROR";
                        } else if (httpResponse.status === 400 && httpResponse.data === "e-mail address already in use") {
                            $scope.error = null;
                            $scope.errorEmailExists = "ERROR";
                        } else {
                            $scope.error = "ERROR";
                        }
                    });
            }
        }
    });
