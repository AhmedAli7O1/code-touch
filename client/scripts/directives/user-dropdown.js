codeTouch.directive('bluUserDropdown', ['userFactory', 'EVENT', '$rootScope', 'localStorageFactory', 'CONFIG', '$state', '$window',
    function (user, EVENT, $rootScope, localStorage, CONFIG, $state, $window) {

        'use strict';

        return {
            restrict: "E",
            replace: true,
            scope: {},
            templateUrl: "templates/user-dropdown.html",
            link: function (scope, element, attrs) {

                // init user variable on directive scope
                scope.user = scope.user || {};
                // set user variable to dir
                var dir = scope.user;

                // login user with email & password
                dir.login = function () {
                    dir.loginLoading = true; // change login button state to loading

                    user.login(dir.userEmail, dir.password)
                        .then((res) => {
                            // res.token & res.userData
                            var userData = res.userData;
                            userData.token = res.token;

                            // save user data in the local storage 
                            localStorage.storeObject(CONFIG.TOKEN_STORE_KEY, userData);

                            dir.loginLoading = false; // change login button state back
                             
                        })
                        .catch((err) => {
                            console.log(err);
                            if (err.data.error === "user_not_found") {
                                dir.emailErr = true;
                                dir.passErr = false;
                            }
                            else if (err.data.error === "invalid_password") {
                                dir.passErr = true;
                                dir.emailErr = false;
                            }
                            dir.loginLoading = false; // change login button state back
                        });
                };

                // user logout
                dir.logout = function () {
                    user.logout().then(() => { 

                        // remove user data from local storage
                        localStorage.remove(CONFIG.TOKEN_STORE_KEY);

                        $rootScope.userInfo = null;

                    });
                };

                // on user login 
                scope.$on(EVENT.USER_LOGIN, function (e, userData) {

                    // change local settings
                    dir.isLoggedIn = true;
                    dir.fullName = userData.displayName;
                    dir.userImage = userData.imageUrl;

                    if(userData.state !== 'active') {
                        $rootScope.showEmailConfirmMsg = true;
                    }

                    //$state.reload(); // reload current state

                });

                // on user logout
                scope.$on(EVENT.USER_LOGOUT, function () {

                    dir.isLoggedIn = false
                    dir.fullName = '';
                    dir.userImage = '';

                    //$state.reload(); // reload current state
                    
                });

                // watch the global user variable
                $rootScope.$watch('userInfo', function (value) {
                    // if user data exist log in
                    if (value) {
                        $rootScope.$broadcast(EVENT.USER_LOGIN, value);
                    }
                    else {
                        $rootScope.$broadcast(EVENT.USER_LOGOUT);
                    }
                }); 

                /**
                 * on load look for local user Credentials
                 */
                var userData = localStorage.getObject(CONFIG.TOKEN_STORE_KEY);

                if (userData && userData.id) {

                    // verify user token
                    user.verifyToken()
                        .then(() => {
                            // fires user login event
                            $rootScope.userInfo = userData;
                        })
                        .catch(() => {
                            // fire user login event
                            $rootScope.userInfo = null;

                            // clear user data from local storage
                            localStorage.remove(CONFIG.TOKEN_STORE_KEY);

                        });

                }

                /**
                 * determine user state on local storage values changes 
                 */

                scope.$on(EVENT.LOCAL_STORAGE_CHANGE, (event, key, value) => {
                    // if user data changed
                    if (key === CONFIG.TOKEN_STORE_KEY) {
                        if (value && value.id) {
                            // change user data
                            $rootScope.userInfo = value;
                        }
                    }
                });

                scope.$on(EVENT.LOCAL_STORAGE_REMOVE, (event, key) => {
                    // if user data removed
                    if (key === CONFIG.TOKEN_STORE_KEY) {
                        $rootScope.userInfo = null;
                    }
                });

            }
        };

    }
]);