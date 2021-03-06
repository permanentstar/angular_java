'use strict';

/* Controllers */

app.controller('MainController', function ($scope,$resource,User) {
        $scope.options = [
            {id:1,text:"op1"},
            {id:2,text:"op2"},
            {id:3,text:"op3"},
            {id:4,text:"op4"},
            {id:5,text:"op5"}
        ];
    $scope.selected = $scope.options[0];
    $scope.viewNav = [
        {href:'logout',class:'glyphicon-log-out',text:'Log out'},
        {href:'login',class:'glyphicon-log-in',text:'Authenticate'},
        {href:'register',class:'glyphicon-plus-sign',text:'Register'}
    ];
    $scope.viewNav.title='Auth';
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
