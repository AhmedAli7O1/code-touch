codeTouch.factory('userFactory', ['uploadFactory','API','$resource',
    function (upload, API, $resource) {
        'use strict';

        return {

            // register new user
            register: function (userInfo) {

                var userData = {
                    username: userInfo.email,
                    firstname: userInfo.firstName,
                    lastname: userInfo.lastName,
                    password: userInfo.password
                };

                // if user has picture use method one 
                if(userInfo.picture) {
                    return new Promise((resolve, reject) => {

                        userData.file = userInfo.picture;
                        // upload to the server 
                        upload(API.USER_REGISTER_PIC, userData, function (err, res) {
                            
                                if (err) return reject(err);
                                res.needApply = true; // means you need to apply this data to the scope in order to be reflected
                                resolve(res.data);
                            
                        });

                    });
                    
                }
                else {

                    return $resource(API.USER_REGISTER).save({}, userData).$promise;

                }


            },

            // validate user email
            validateEmail: function (email) {
                return $resource(API.VALIDATE_EMAIL, { email: email }).get().$promise;
            },

            // login user account
            login: function(email, password){

                return $resource(API.USER_LOGIN)
                    .save({}, { email: email, password: password }).$promise;

            },

            // get current user info
            getCurrent: function () {
                return $resource(API.GET_CURRENT_USER_INFO).get().$promise;
            },

            // logout current user
            logout: function() {

                return $resource(API.USER_LOGOUT);

            }

        }

    }
]);