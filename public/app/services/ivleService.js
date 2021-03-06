"use strict";

angular.module("schoolines").factory("IVLEService", function($q, $http, $location, $cookies, $httpParamSerializer, $localStorage, Session) {
    var ivleService = {};
    var ivle_api_key = "UY5RaT4yK3lgWflM47CJo";

    /* Login Function */
    ivleService.getLoginUrl = function() {
        var loginLink = "https://ivle.nus.edu.sg/api/login/?";
        var urlPath = $location.protocol() + "://" + $location.host() + ':' + $location.port() + "/#/";
        var params = $httpParamSerializer({
            apikey: ivle_api_key,
            url: urlPath
        });

        return loginLink + params;
    }

    /* Create User */
    ivleService.createUser = function(token) {
        return $http.post('/userManagement/createUser', {
            token: token
        }).then(function(res) {
            Session.userId = res.data.userId;
            $cookies.put("userId", res.data.userId);
            $localStorage.userId = res.data.userId;
            return res.data;
        });
    }

    /* Get Modules */
    ivleService.getModules = function(token) {
        console.log($localStorage.modules);
        if (!!$localStorage.modules && $localStorage.modules.length > 0)
            return $q.resolve();
        else
            return $http.post('/userManagement/getModules', {
                token: token
            }).then(
                function successCallback(response) {
                    $localStorage.modules = response.data.modulesCodes;
                },
                function errorCallback(response) {
                    console.log("Encountered Error: ", response.statusText);
                });
    }

    return ivleService;
});
