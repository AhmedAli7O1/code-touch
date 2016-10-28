codeTouch.factory('localStorageFactory', ['$window', '$rootScope', 'EVENT',
    function ($window, $rootScope, EVENT) {
        'use strict';

        return {

            store: function (key, value) {
                $window.localStorage[key] = value;
                $rootScope.$broadcast(EVENT.LOCAL_STORAGE_CHANGE, value);
            },

            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },

            remove: function (key) {
                $window.localStorage.removeItem(key);
                $rootScope.$broadcast(EVENT.LOCAL_STORAGE_REMOVE, key);
            },

            storeObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
                $rootScope.$broadcast(EVENT.LOCAL_STORAGE_CHANGE, key, value);
            },

            getObject: function (key) {

                if ($window.localStorage[key]) {
                    try {
                        return JSON.parse($window.localStorage[key]);
                    }
                    catch (e) {
                        $window.localStorage.removeItem(key);
                    }
                }
                else {
                    return null;
                }

            }
        };

    }
]);