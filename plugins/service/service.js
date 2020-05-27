const ServiceModel = require('./serviceModel');
const MetadataModel = require('./metadataModel');
const ServiceController = require('./serviceController');

module.exports = function(options, imports, register) {
    var api = imports.api;
    var db = imports.db;
    var jwt = imports.jwt;
    var user = imports.user;
    var registered_services = [];

    var metadataModel = MetadataModel(db);
    var serviceModel = ServiceModel(db, user.model, metadataModel);
    var serviceController = ServiceController(serviceModel, user.model, metadataModel, registered_services);
    var router = api.router();

    router.get('/', jwt.validate, serviceController.getAll);
    router.post('/', jwt.validate, serviceController.add);
    router.get('/:id', jwt.validate, serviceController.get);
    router.delete('/:id', jwt.validate, serviceController.remove);
    router.put('/:id', jwt.validate, serviceController.update);
    router.use('/:id/:service', jwt.validate, serviceController.service);

    api.useRouter("/service", router);

    register(null, {
        service: {
            model: function() {
                return serviceModel;
            },
            register: function (service_name, method_type, callback) {
                registered_services.push({service_name : service_name, method_type : method_type, callback : callback});
            }
        },
        service_metadata: {
            model: function() {
                return metadataModel;
            },
        }
    });

}
