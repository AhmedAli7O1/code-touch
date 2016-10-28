codeTouch.controller('RegisterCtrl', ['$scope', '$rootScope','userFactory','$state','$timeout',
    function ($scope, $rootScope, user, $state, $timeout) {
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
            ctr.registerLoading = true; // change register button state to loading

            var userInfo = {
                email: ctr.rgEmail,
                firstName: ctr.rgName,
                lastName: ctr.rgName2,
                password: ctr.rgPassword,
                picture: ctr.file
            };

            // register new user
            user.register(userInfo)
                .then((res) => {

                    if (ctr.file) {
                        $scope.$apply(() => {

                            ctr.hasError = false;
                            ctr.hasSuccess = true;
                            ctr.msgTitle = "Success";
                            ctr.msgBody = res.message;
                            ctr.clear();

                        });
                    }
                    else {
                        ctr.hasError = false;
                        ctr.hasSuccess = true;
                        ctr.msgTitle = "Success";
                        ctr.msgBody = res.message;
                        ctr.clear();
                    }

                    // redirect user to home page.
                    $timeout(() => {
                        $state.go('app');
                    }, 5000);

                    ctr.registerLoading = false; // change register button state back
                })
                .catch((err) => {
                    ctr.hasError = true;
                    ctr.hasSuccess = false;
                    ctr.msgTitle = "Error";
                    ctr.msgBody = err.data.message;
                    console.log(err);
                    ctr.registerLoading = false; // change register button state back
                });

        };


        return ctr;

    }
]);