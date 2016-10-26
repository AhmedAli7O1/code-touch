codeTouch.factory('uploadFactory', ['Upload',
    function (Upload) {
        'use strict';

        return function (url, data, cb) {
            
            Upload.upload({
                url: url,
                data: data
            })
            .then(
                function (res) {
                    if (res.data.state === true) {
                        cb(null, res.data.message);
                    }
                    else {
                        cb(res.data.message, null);
                    }
                },
                function (err) {
                    cb(err.data.message, null);
                }
            );
        }

    }
]);