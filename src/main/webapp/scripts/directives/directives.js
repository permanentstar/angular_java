'use strict';

angular.module("app.directives")
    .directive('activeLink', function(location) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var clazz = attrs.activeLink;
                var path = attrs.href;
                path = path.substring(1); //hack because path does bot return including hashbang
                scope.location = location;
                scope.$watch('location.path()', function(newPath) {
                    if (path === newPath) {
                        element.addClass(clazz);
                    } else {
                        element.removeClass(clazz);
                    }
                });
            }
        };
    }).directive('passwordStrengthBar', function() {
        return {
            replace: true,
            restrict: 'E',
            template: '<div id="strength">' +
                      '<small>Password strength:</small>' +
                      '<ul id="strengthBar">' +
                        '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>' +
                      '</ul>' +
                    '</div>',
            link: function(scope, iElement, attr) {
                var strength = {
                    colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                    mesureStrength: function (p) {

                        var _force = 0;
                        var _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "

                        var _lowerLetters = /[a-z]+/.test(p);
                        var _upperLetters = /[A-Z]+/.test(p);
                        var _numbers = /[0-9]+/.test(p);
                        var _symbols = _regex.test(p);

                        var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                        var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;

                        _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                        _force += _passedMatches * 10;

                        // penality (short password)
                        _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

                        // penality (poor variety of characters)
                        _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                        _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                        _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

                        return _force;

                    },
                    getColor: function (s) {

                        var idx = 0;
                        if (s <= 10) { idx = 0; }
                        else if (s <= 20) { idx = 1; }
                        else if (s <= 30) { idx = 2; }
                        else if (s <= 40) { idx = 3; }
                        else { idx = 4; }

                        return { idx: idx + 1, col: this.colors[idx] };
                    }
                };
                scope.$watch(attr.passwordToCheck, function(password) {
                    if (password) {
                        var c = strength.getColor(strength.mesureStrength(password));
                        iElement.removeClass('ng-hide');
                        iElement.find('ul').children('li')
                            .css({ "background": "#DDD" })
                            .slice(0, c.idx)
                            .css({ "background": c.col });
                    }
                });
            }
        }
    })
    .directive('showValidation', function() {
        return {
            restrict: "A",
            require:'form',
            link: function(scope, element, attrs, formCtrl) {
                element.find('.form-group').each(function() {
                    var $formGroup=$(this);
                    var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

                    if ($inputs.length > 0) {
                        $inputs.each(function() {
                            var $input=$(this);
                            scope.$watch(function() {
                                return $input.hasClass('ng-invalid') && $input.hasClass('ng-dirty');
                            }, function(isInvalid) {
                                $formGroup.toggleClass('has-error', isInvalid);
                            });
                        });
                    }
                });
            }
        };
    })
    .directive('pagination',function(){
        return {
            restrict:'EA',
            template:'<ul class="pagebar">' +
            '<li class="first" ng-show="pageCurrent != 1"><a ng-click="setFirstPage()"><i></i></a></li>' +
            '<li class="prev" ng-show="pageCurrent != 1"><a ng-click="setPreviousPage()"><i></i></a></li>' +
            '<li ng-repeat="page in showPages" ng-class="{\'active\':page.num == pageCurrent}"><a ng-click="switchPage(page.num)">{{page.text}}</a></li>'+
            '<li class="next" ng-show="pageCurrent != pageTotal"><a ng-click="setNextPage()"><i></i></a></li>' +
            '<li class="last" ng-show="pageCurrent != pageTotal"><a ng-click="setLastPage()"><i></i></a></li>' +
            '</ul>',
            scope:{
                pageMaxShow:'@',
                pageCurrent:'=',
                pageTotal:'=',
                setPage:'&'
            },
            link:function(scope,element,attrs){
                var me = scope;
                if(!me.pageMaxShow || me.pageMaxShow <= 0){
                    me.pageMaxShow = 5;
                }
                var radius = Math.ceil(me.pageMaxShow/2);
                var handler = me.setPage();
                me.setFirstPage = function(){
                    handler(1);
                };
                me.setLastPage = function(){
                    handler(me.pageTotal);
                };
                me.setNextPage = function(){
                    handler(me.pageCurrent+1);
                };
                me.setPreviousPage = function(){
                    handler(me.pageCurrent-1);
                };
                me.switchPage = function(page){
                    handler(page);
                };
                me.$watch('pageCurrent',function(to,from){
                    freshPagin();
                });
                me.$watch('pageTotal',function(to,from){
                    freshPagin();
                });
                function freshPagin(){
                    var page;
                    me.showPages = [];
                    for(var i = 0;i<me.pageTotal;i++){
                        page = null;
                        if(i+1 >= me.pageCurrent - radius && i+1<= me.pageCurrent + radius){//shown
                            page = {num:i+1,text:i+1};
                        }else if(i+1 == (me.pageCurrent - radius - 1)){
                            page = {num:Math.ceil((i+1)/2),text:'...'};
                        }else if(i+1 == (me.pageCurrent + radius + 1)){
                            page = {num:Math.ceil((i+1+me.pageTotal)/2),text:'...'};
                        }
                        if(page){
                            me.showPages.push(page);
                        }
                    }
                }
            }
        }
    })
    .directive('selectDropDown',function(){
        return {
            restrict:'EA',
            templateUrl:'views/template/selectDropDown.html',
            replace:true,
            scope:{
                options:'='
            },
            require:'?ngModel',
            link:function(scope,element,attrs,ngModel){
                var me = scope;
                me.select = function($index){
                    me.selected = me.options[$index];
                    me.$apply(function(){
                        ngModel.$setViewValue(me.options[$index]);
                    });
                };
                ngModel.$render = function(){
                    me.selected = ngModel.$viewValue;
                };
                element.mouseenter(function(){
                    element.find(".dropdown-menu").stop().slideDown(500);
                }).mouseleave(function(){
                    element.find(".dropdown-menu").stop().slideUp(500);
                });
            }
        }
    })
    .directive('navDropDown',function(){
        return {
            restrict:'EA',
            template:'<a class="dropdown-toggle">'+
                '<span class="glyphicon glyphicon-user"></span> '+
                '<span class="hidden-tablet">{{options.title}}</span>'+
                '<b class="caret"></b></a>'+
                '<ul class="dropdown-menu">'+
                '<li ng-repeat="option in options">'+
                '<a href="#/{{option.href}}"><span class="glyphicon {{option.class}}"></span> <span>{{option.text}}</span></a>'+
                '</li></ul>',
            scope:{
                options:'='
            },
            link:function(scope,element){
                var me = scope;
                element.mouseenter(function(){
                    element.find(".dropdown-menu").stop().slideDown(500);
                }).mouseleave(function(){
                    element.find(".dropdown-menu").stop().slideUp(500);
                });
            }
        }
    })
;
