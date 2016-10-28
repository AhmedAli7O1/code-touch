codeTouch.directive('bluValidateEmail', ['userFactory',
    function (user) {
        'use strict';

        return {

            restrict: 'A',
            link: function (scope, element, attrs) {

                // call server to see if this email is valid return true
                element.on('change', function () {

                    // validate user email using element.val()
                    user.validateEmail(element.val())
                        .then((res) => scope.register.registerForm.rgEmail.$setValidity("email", true))
                        .catch(() => scope.register.registerForm.rgEmail.$setValidity("email", false));

                });

            }

        }

    }
]);