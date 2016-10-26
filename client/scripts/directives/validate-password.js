codeTouch.directive('bluValidatePassword', function () {
    'use strict';

    return {

        restrict: 'A',
        link: function (scope, element, attrs) {

            // confirm that user enterd the same password 
            // ** later w'll make more advanced validation

            var pass1 = "", pass2 = "";

            scope.$watch(attrs.ngModel, function (value) {
                
                pass2 = value;
                validate();

            });

            scope.$watch(attrs.bluValidatePassword, function (value) {

                pass1 = value;
                validate();
                
            });

            function validate () {
                if (pass1 === pass2) {
                    scope.register.registerForm.rgPassword2.$setValidity("password", true);
                }
                else {
                    scope.register.registerForm.rgPassword2.$setValidity("password", false);
                }
            }

        }
 
    }

});