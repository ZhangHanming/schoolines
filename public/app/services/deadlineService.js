'use strict';

angular.module("schoolines").factory("DeadlineService", function($http, $httpParamSerializer, $location, $localStorage, Session){
    var deadlineService = {};

    deadlineService.create = function(deadline){
        deadline["userId"] = Session.userId;
        var postParam = {
            deadline: deadline
        }

        return $http.post("/deadlineManagement/create", postParam).then(function(res){
            return res;
        });
    }

    /* Get Deadline */
    deadlineService.getDeadline = function() {
        // Session NOT WORKING
        var moduleCodes = Session.modules;
        //var moduleCodes = ['BT1101', 'MA1101R', 'MKT1003X'];
        return $http.get('/deadlineManagement/getDeadlines?' + $httpParamSerializer(moduleCodes)).then(
            function successCallback(response) {
                $localStorage.deadlines = response.data;
            }, function errorCallback(response) {
                console.log("Encountered Error: ", response.statusText);
            });
    }


    return deadlineService;
})
