codeTouch.directive('bluValidateEmail', function () {
    'use strict';

    return {

        restrict: 'A',
        link: function (scope, element, attrs) {

            // call server to see if this email is valid return true
            element.on('change', function () {
                //TODO

                // validate user email using element.val()
                
                // reflect result on the input 
                scope.register.registerForm.rgEmail.$setValidity("email", false);

            });

        }
 
    }

});