codeTouch.controller('loginSuccessCtrl', ['$state', '$stateParams', 'localStorageFactory', 'userFactory', 'CONFIG',
    function ($state, $stateParams, localStorage, user, CONFIG) {
        'use strict';

        var ctr = this;
        var userData = {};
        var token = $stateParams.token;

        if (token) {
            userData.token = token;
            localStorage.storeObject(CONFIG.TOKEN_STORE_KEY, userData);
        }

        // now get this user information
        // note: that the token will be automatically attached to the next request.
        user.getCurrent()
            .then((res) => {
                
                // compine user data with the token
                res.userData.token = token;

                // now store all needed user data
                localStorage.storeObject(CONFIG.TOKEN_STORE_KEY, res.userData);

                /*
                 * redirect the user to home page which will detect
                 * user credantials stored and automatically login the user 
                 */
                $state.go('app');

            })
            .catch((err) => {

                $state.go('app.register');

                console.log(err);
            });

        return ctr;

    }
]);