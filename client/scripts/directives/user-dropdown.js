codeTouch.directive('bluUserDropdown', ['userFactory', 'EVENT', '$rootScope', 'localStorageFactory', 'CONFIG', '$state',
    function (user, EVENT, $rootScope, localStorage, CONFIG, $state) {

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

                            // fire login event for all listeners 
                            $rootScope.$broadcast(EVENT.USER_LOGIN, userData);
                             
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
                        })
                        .finally(() => dir.loginLoading = false ); // change login button state back
                };

                // user logout
                dir.logout = function () {
                    user.logout().then(() => { 

                        // remove user data from local storage
                        localStorage.remove(CONFIG.TOKEN_STORE_KEY);

                        // fire logout event
                        $rootScope.$broadcast(EVENT.USER_LOGOUT);
                    });
                };

                // on user login 
                $rootScope.$on(EVENT.USER_LOGIN, function (e, userData) {

                    // set user data on root scope w'll move that later to userCtrl
                    $rootScope.userInfo = userData; 

                    // change local settings
                    dir.isLoggedIn = true;
                    dir.fullName = 'Ahmed Ali';
                    dir.userImage = userData.imageUrl;

                    //$state.reload(); // reload current state

                });

                // on user logout
                scope.$on(EVENT.USER_LOGOUT, function () {

                    // set user data on root scope to null
                    $rootScope.userInfo = null;

                    dir.isLoggedIn = false
                    dir.fullName = '';
                    dir.userImage = '';

                    //$state.reload(); // reload current state
                    
                });

                // on load look for local user Credentials
                var userData = localStorage.getObject(CONFIG.TOKEN_STORE_KEY);

                if (userData) {
                    // fire user login event
                    $rootScope.$broadcast(EVENT.USER_LOGIN, userData);
                }

            }
        };

    }
]);