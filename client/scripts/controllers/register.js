codeTouch.controller('RegisterCtrl', ['$rootScope',
    function ($rootScope) {
        'use strict';

        $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                componentHandler.upgradeAllRegistered();
            });
        });

    }
]);