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
                        cb(null, res);
                    }
                    else {
                        cb(res, null);
                    }
                },
                function (err) {
                    cb(err, null);
                }
            );
        }

    }
]);