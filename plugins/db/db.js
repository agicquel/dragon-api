require('dotenv').config();
const mongoose = require('mongoose');

// connection to mongodb server
mongoose.Promise = global.Promise;
if(!process.env.MONGO_USERNAME || !process.env.MONGO_PASSWORD || (process.env.MONGO_USERNAME === "" && process.env.MONGO_PASSWORD === "")) {
    mongoose.connect('mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}
else {
    mongoose.connect('mongodb://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DATABASE , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}

var db = mongoose.connection;
db.on('error', function (err) {
    console.error('MongoDB connection error:', err);
});
db.once('open', function callback() {
    console.info('MongoDB connection is established');
});
db.on('disconnected', function() {
    console.error('MongoDB disconnected!');
    mongoose.connect(process.env.MONGO_URL, {server:{auto_reconnect:true}});
});
db.on('reconnected', function () {
    console.info('MongoDB reconnected!');
});

module.exports = function (options, imports, register) {
    register(null, {
        db: {
            schema: function(schema) {
                return new mongoose.Schema(schema);
            },
            model: function(name, schema) {
                return mongoose.model(name, schema);
            },
        }
    });
}
