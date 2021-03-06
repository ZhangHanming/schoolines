"use strict"


angular.module("schoolines").directive("deadline", function() {
    return {
        restrict: "AE",
        templateUrl: "/app/directives/deadline.html",
        controller: ["$mdSidenav", "$location", "$scope", "$timeout", "$log", "AuthService", "IVLEService", "Session", "DeadlineService", "$localStorage",
            function($mdSidenav, $location, $scope, $timeout, $log, AuthService, IVLEService, Session, DeadlineService, $localStorage) {
                $scope.buffering = true;
                AuthService.autologin().then(function() {

                    IVLEService.getModules(Session.token).then(function() {
                        $scope.buffering = false;
                        $scope.modules = ["All", "Hidden"];
                        $scope.modules = $scope.modules.concat($localStorage.modules);
                        DeadlineService.getDeadline().then(function() {

                            var deadlineArray = $localStorage.deadlines.deadlineArray;

                            //add colors
                            var colors = ["#9dc6d8", "#00b3ca", "#7dd0b6", "#1d4e89", "#d2b29b", "#e38690", "#f69256", "#ead98b", "#965251", "#c6cccc"];
                            var moduleList = $scope.modules;
                            console.log(moduleList);
                            for (var d of deadlineArray) {
                                // TODO change color
                                var modIndex = moduleList.indexOf(d.module)

                                if (modIndex >= 0) {
                                    d.color = colors[modIndex];
                                } else {
                                    d.color = "red";
                                }
                            }


                            var deadlines = deadlineArray.filter(function(deadline) {
                                if (!$localStorage.hiddenDeadlines) return true;
                                return !$localStorage.hiddenDeadlines.includes(deadline.id);
                            });
                            $scope.deadlines = deadlines;

                            $scope.slash = function(mod) {
                                var slashIndex = mod.indexOf('/');

                                if (slashIndex >= 0) {
                                    console.log(slashIndex);
                                    return mod.substring(0, slashIndex);
                                } else {
                                    return mod;
                                }
                            }


                            $scope.filter = function(mod) {
                                $scope.selected = mod;
                                DeadlineService.currentMod = mod;
                                if (mod == "All") {
                                    $scope.deadlines = deadlines;
                                    $scope.close();
                                    return;
                                }

                                if (mod == "Hidden") {
                                    $scope.deadlines = deadlineArray.filter(function(deadline) {
                                        return (!!$localStorage.hiddenDeadlines) ? $localStorage.hiddenDeadlines.includes(deadline.id) : false;
                                    });
                                    $scope.close();
                                    return;
                                }

                                var d = [];
                                for (var deadline of deadlines) {
                                    if (deadline.module == mod)

                                        d.push(deadline);
                                }
                                $scope.deadlines = d;
                                $scope.close();
                                if ($scope.deadlines.length == 0)
                                    sweetAlert("Oops...", "You don't have any deadlines for this module\n Press + to contribute a deadline!", "error");
                            }
                            if (!!DeadlineService.currentMod)
                                $scope.filter(DeadlineService.currentMod);


                        });

                    });
                });

                $scope.view = function(deadline) {
                    DeadlineService.deadlineDetail = deadline;
                    $location.path('/deadlineDetail');
                }

                $scope.close = function() {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav('left').close()
                        .then(function() {
                            $log.debug("close LEFT is done");
                        });

                };

                $scope.toggleLeft = buildDelayedToggler('left');
                /**
                 * Supplies a function that will continue to operate until the
                 * time is up.
                 */
                function debounce(func, wait, context) {
                    var timer;

                    return function debounced() {
                        var context = $scope,
                            args = Array.prototype.slice.call(arguments);
                        $timeout.cancel(timer);
                        timer = $timeout(function() {
                            timer = undefined;
                            func.apply(context, args);
                        }, wait || 10);
                    };
                }


                /**
                 * Build handler to open/close a SideNav; when animation finishes
                 * report completion in console
                 */
                function buildDelayedToggler(navID) {
                    return debounce(function() {
                        // Component lookup should always be available since we are not using `ng-if`
                        $mdSidenav(navID)
                            .toggle()
                            .then(function() {
                                $log.debug("toggle " + navID + " is done");
                            });
                    }, 200);
                }

                function buildToggler(navID) {
                    return function() {
                        // Component lookup should always be available since we are not using `ng-if`
                        $mdSidenav(navID)
                            .toggle()
                            .then(function() {
                                $log.debug("toggle " + navID + " is done");
                            });
                    }
                }

            }
        ]
    }
});
