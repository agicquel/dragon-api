module.exports = function(Service, User, ServiceMetadata, registered_services) {
    return {
        getAll : function (req, res) {
            Service.find({owner: res.locals.userId}, function (err, services) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(200).json(services);
                }
            });
        },

        get : function (req, res) {
            Service.findOne({_id: req.params.id}, function (err, service) {
                if (err) {
                    res.status(400).send(err);
                }
                else if(service == null) {
                    res.status(404).send("Service not found");
                }
                else {
                    res.status(200).json(service);
                }
            });
        },

        update : function (req, res) {
            Service.findOneAndUpdate({
                    _id: req.params.id,
                },
                req.body,
                {new: true},
                function (err, service) {
                    if (err) {
                        res.status(405).send(err);
                    }
                    else if(service === null) {
                        res.status(404).send("Service not found");
                    }
                    else {
                        res.status(200).json(service);
                    }
                });
        },

        remove : function (req, res) {
            Service.deleteOne({
                _id: req.params.id,
            }, function (err, doc) {
                if (err || doc.ok !== 1) {
                    res.status(400).send("Invalid ID supplied");
                }
                else if(doc.deletedCount === 0) {
                    res.status(404).send("Service not found");
                }
                else {
                    res.status(200).send("Service deleted");
                }
            });
        },

        add : function (req, res) {
            Service.create({
                owner: res.locals.userId,
                service_name: req.body.service_name,
            }, function (err, result) {
                if (err) {
                    res.status(405).send("Invalid input.");
                }
                else {
                    res.status(200).json({
                        status: "success",
                        message: "Service successfully created.",
                        data: result
                    });
                }
            });
        },

        service : function (req, res) {
            Service.findOne({_id: req.params.id}, function (err, service) {
                if (err) {
                    res.status(400).send(err);
                }
                else if(service == null) {
                    res.status(404).send("Service id invalid.");
                }
                else {
                    if(req.params.service === undefined || !service.plugins.includes(req.params.service)) {
                        res.status(404).send("Plugin service not registered.");
                    }
                    else {
                        for(const plugin of registered_services) {
                            if(plugin.service_name === req.params.service && plugin.method_type.toUpperCase() === req.method) {
                                plugin.callback(req, res);
                                return;
                            }
                        }
                        res.status(404).send("Plugin service not installed.");
                    }
                }
            });
        }
    }
}
