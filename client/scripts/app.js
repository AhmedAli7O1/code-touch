var codeTouch = angular.module('codeTouch', [
    'ui.router',
    'ngFileUpload',
    'ngResource'
]);

codeTouch.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    "use strict";

    // For any unmatched url, redirect to /index
    $urlRouterProvider.otherwise("/");

    
    $stateProvider

        .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: "views/header.html"
                },
                'content': {
                    templateUrl: "views/home.html"
                },
                'footer': {
                    templateUrl: "views/footer.html"
                }
            },
            data: { auth: 'none' }
        })

        .state('app.register', {
            url: 'register',
            views: {
                'content@': {
                    templateUrl: "views/register.html",
                    controller: "RegisterCtrl",
                    controllerAs: "register"
                    
                }
            },
            data: { auth: 'none' }
        })
        
        .state('app.loginSuccess', {
            url: 'login/success?token',
            views: {
                'content@': {
                    templateUrl: "views/login-success.html",
                    controller: "loginSuccessCtrl",
                    controllerAs: "loginSuccess"
                }
            },
            data: { auth: 'none' }
        });

    // register the http interceptors
    $httpProvider.interceptors.push('httpInterceptor');

});