codeTouch.controller('RegisterCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
        'use strict';

        var ctr = this;

        // set form to it's default state
        ctr.clear = function () {
            ctr.rgName = "";
            ctr.rgName2 = "";
            ctr.rgEmail = "";
            ctr.rgPassword = "";
            ctr.rgPassword2 = "";
            ctr.file = "";
            ctr.registerForm.$setPristine();
        };

        return ctr;

    }
]);