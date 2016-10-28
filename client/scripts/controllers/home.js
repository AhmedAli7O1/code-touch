codeTouch.controller('homeCtrl', ['localStorageFactory', 'CONFIG', 'EVENT', '$rootScope', 'userFactory',
    function (localStorage, CONFIG, EVENT, $rootScope, user) {
        'use strict';

        var ctr = this;

        ctr.resendEmail = function () {
            ctr.resendEmailLoading = true; // change the button state to loading

            user.resendEmail()
            
            .then((res) => {
                console.log(res);
                ctr.resendEmailLoading = false; // change the button state back
                $rootScope.showEmailConfirmMsg = false; // close the modal
            })

            .catch((err) => {
                console.log(err);
                ctr.resendEmailLoading = false; // change the button state back
            });

        };

        return this;

    }
]);