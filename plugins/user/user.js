const UserModel = require('./userModel');
const UserController = require('./userController');

module.exports = function(options, imports, register) {
    var api = imports.api;
    var db = imports.db;
    var jwt = imports.jwt;

    var userModel = UserModel(db);
    var userController = UserController(userModel);
    var router = api.router();

    router.post('/', userController.add);
    router.post('/auth/login', userController.authenticate);
    router.get('/', jwt.validate, userController.getAll);
    router.get('/:id', jwt.validate, userController.get);
    router.put('/:id', jwt.validate, userController.update);
    router.delete('/:id', jwt.validate, userController.remove);

    api.useRouter("/users", router);

    register(null, {
        user: {
            model: function(name, schema) {
                return userModel;
            },
        }
    });

}
