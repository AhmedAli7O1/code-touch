codeTouch.factory('userFactory', ['uploadFactory','API','$resource',
    function (upload, API, $resource) {
        'use strict';

        return {

            // register new user
            register: function (userInfo) {

                var userData = {
                    email: userInfo.email,
                    firstname: userInfo.firstName,
                    lastname: userInfo.lastName,
                    password: userInfo.password
                };

                // if user has picture use method one 
                if(userInfo.picture) {
                    userData.file = userInfo.picture;

                    // upload to the server 
                    upload(API.USER_REGISTER_PIC, userData, function (err, msg) {
                        return new Promise((resolve, reject) => {
                            if (err) return reject(err);
                            resolve(msg);
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
            }

        }

    }
]);