module.exports = function(options, imports, register) {
    var service = imports.service;
    var metadata = imports.service_metadata;

    console.log("test registered");
    service.register("test", "GET", function (req, res) {
        res.status(200).send("test");
    });

    register(null, {});
}
