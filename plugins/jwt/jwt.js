const jsonwebtoken = require('jsonwebtoken');

module.exports = function(options, imports, register) {
    var api = imports.api;
    api.set('secretKey', process.env.JWT_KEY);

    register(null, {
        jwt: {
            validate : function(req, res, next) {
                jsonwebtoken.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
                    if (err) {
                        res.status(400).json({
                            success: false,
                            message: 'Token is not valid.'
                        });
                    }
                    else {
                        res.locals.userId = decoded.id;
                        next();
                    }
                });
            }
        }
    });
}
