codeTouch.directive('bluUserDropdown', ['userFactory',
    function (user) {

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
                    user.login(dir.userEmail, dir.password)
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                };

            }
        };

    }
]);