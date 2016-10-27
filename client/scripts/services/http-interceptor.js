codeTouch.factory('httpInterceptor', ['$q', '$rootScope', '$log', 'localStorageFactory', 'CONFIG',
	function ($q, $rootScope, $log, localStorage, CONFIG) {
		return {
			'request': function (config) {
				//$log.info({ httpReq: config });
				// get token from the local storage and set to every request
				var userData = localStorage.getObject(CONFIG.TOKEN_STORE_KEY);
				if(userData){
					config.headers['x-access-token'] = userData.token;
				}
				
				return config;
			},

			'requestError': function (rejection) {
				//$log.error({ httpReqError: rejection });
				return $q.reject(rejection);
			},

			'response': function (response) {
				$log.info({ httpRes: response });
				return response;
			},

			'responseError': function (rejection) {

				//$log.error({ httpResError: rejection });


				return $q.reject(rejection);
			}

		};
	}
]);