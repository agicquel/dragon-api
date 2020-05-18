require('dotenv').config();
const express = require('express');
const api = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const csp = require('helmet-csp');
const port = process.env.PORT || 6666;

api.use(helmet());
api.use(csp({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        sandbox: ['allow-forms', 'allow-scripts'],
        reportUri: '/report-violation',
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
        upgradeInsecureRequests: true,
        workerSrc: false
    }
}));

api.use(bodyParser.urlencoded({
    extended: false
}));
api.use(bodyParser.json());

api.listen(port, () => {
    console.log(`Express server started on port : ${port}`);
});

module.exports = function(options, imports, register) {
    register(null, {
        api: {
            router: function() {
                return express.Router();
            },
            useRouter : function (fn, router) {
                api.use(fn, router);
            },
            set : function set(setting, val) {
                api.set(setting, val);
            }
        }
    });
};
