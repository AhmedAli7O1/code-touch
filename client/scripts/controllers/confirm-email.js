codeTouch.controller('confirmEmailCtrl', ['$state', '$stateParams', 'localStorageFactory', 'CONFIG',
    function ($state, $stateParams, localStorage, CONFIG) {
        'use strict';

        var ctr = this;

        var state = $stateParams.state;

        if (state && state === 'success') {
            ctr.state = 'success';
            ctr.title = 'Success';
            ctr.msg = "your account is now verified, thank you!";
            localStorage.remove(CONFIG.TOKEN_STORE_KEY); // remove old token
        }
        else if (state && state === 'error&key'){
            ctr.state = 'error';
            ctr.title = 'Error';
            ctr.msg = 'verification not valid please login again to send another verification email!';
        }
        else if (state && state === 'error&locate'){
            ctr.state = 'error';
            ctr.title = 'Error';
            ctr.msg = 'error while trying to retrieve user data, please try again later!';
        }
        else if (state && state === 'error&saving'){
            ctr.state = 'error';
            ctr.title = 'Error';
            ctr.msg = 'error while trying to save user data, please try again later!';
        }
        else {
            $state.go('app'); // redirect to home page
        }

        return ctr;

    }
]);