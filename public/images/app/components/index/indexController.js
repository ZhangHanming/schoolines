'use strict';
angular.module("schoolines")
    .controller('indexController', ["$scope", "$localStorage", "$timeout", "$mdSidenav", "$log", "$location", "$routeParams", "$window", "IVLEService", "DeadlineService", "AuthService", "Session",
            function($scope, $localStorage, $timeout, $mdSidenav, $log, $location, $routeParams, $window, IVLEService, DeadlineService, AuthService, Session) {
                $scope.title = "Schoolines";
                $window.ga('send', 'pageview', { page: $location.url() });

                AuthService.autologin().then(function(){
                    console.log(Session.token);
                    console.log(Session.userId);
                });

                $scope.redirectTo = function(url){
                    $location.path(url);
                }
                    // Save token to session
                    // first time log in
                // if ($routeParams.token) {
                //     IVLEService.createUser(Session.token);
                //
                //     AuthService.login($routeParams.token);
                //     IVLEService.createUser(Session.token).then(function(){
                //         var userId = Session.userId;
                //
                //         $location.url('/');
                //     });
                // }


            }]);