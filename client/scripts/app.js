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
                    templateUrl: "views/home.html",
                    controller: "homeCtrl",
                    controllerAs: "home"
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
            data: { auth: 'no_user' }
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
        })
        
        .state('app.confirmEmail', {
            url: 'login/confirm?state',
            views: {
                'content@': {
                    templateUrl: "views/confirm-email.html",
                    controller: "confirmEmailCtrl",
                    controllerAs: "confirmEmail"
                }
            },
            data: { auth: 'none' }
        });

    // register the http interceptors
    $httpProvider.interceptors.push('httpInterceptor');

});


codeTouch.run(function ($rootScope, $state) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // pervent nav to user/admin pages without auth
        if (toState.data.auth === 'admin' && (!$rootScope.userInfo || !$rootScope.userInfo.isAdmin)) {
            event.preventDefault();
            $state.go('app');
            return false;
        }
        else if (toState.data.auth === 'user' && !$rootScope.userInfo) {
            event.preventDefault();
            $state.go('app');
            return false;
        }
        else if (toState.data.auth === 'no_user' && $rootScope.userInfo) {
            event.preventDefault();
            $state.go('app');
            return false;
        }

    });

});