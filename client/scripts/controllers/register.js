codeTouch.controller('RegisterCtrl', ['$scope', '$rootScope','userFactory',
    function ($scope, $rootScope, user) {
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


        // register new user
        ctr.submit = function () {

            var userInfo = {
                email: ctr.rgEmail,
                firstName: ctr.rgName,
                lastName: ctr.rgName2,
                password: ctr.rgPassword
            };

            // if the user has picture include it
            if (ctr.file) {
                userInfo.picture = ctr.file;
            }

            // register new user
            user.register(userInfo)
                .then((res) => {
                    ctr.hasError = false;
                    ctr.clear();
                })
                .catch((err) => {
                    ctr.hasError = true;
                    ctr.errorTitle = "Error in Registration";
                    ctr.errorMsg = err;
                });

        };



        return ctr;

    }
]);