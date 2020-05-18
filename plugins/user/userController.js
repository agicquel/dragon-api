const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = function(User) {
    return {
        getAll : function (req, res) {
            User.find({}, function (err, user) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(200).json(user);
                }
            });
        },

        get : function (req, res) {
            User.findOne({_id: req.params.id}, function (err, user) {
                if (err) {
                    res.status(400).send(err);
                }
                else if(user == null) {
                    res.status(404).send("User not found");
                }
                else {
                    res.status(200).json(user);
                }
            });
        },

        update : function (req, res) {
            User.findOneAndUpdate({
                    _id: req.params.id,
                },
                req.body,
                {new: true},
                function (err, user) {
                    if (err) {
                        res.status(405).send(err);
                    }
                    else if(user === null) {
                        res.status(404).send("User not found");
                    }
                    else {
                        res.status(200).json(user);
                    }
                });
        },

        remove : function (req, res) {
            User.deleteOne({
                _id: req.params.id,
            }, function (err, doc) {
                if (err || doc.ok !== 1) {
                    res.status(400).send("Invalid ID supplied");
                }
                else if(doc.deletedCount === 0) {
                    res.status(404).send("User not found");
                }
                else {
                    res.status(200).send("User deleted");
                }
            });
        },

        add : function (req, res) {
            User.create({
                email: req.body.email,
                password: req.body.password,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
            }, function (err, result) {
                if (err) {
                    res.status(405).send("Invalid input.");
                }
                else {
                    res.status(200).json({
                        status: "success",
                        message: "User successfully created.",
                        data: result
                    });
                }
            });
        },

        authenticate : function (req, res) {
            User.findOne({
                email: req.body.email
            }, function (err, userInfo) {
                if (err) {
                    res.send(err);
                } else {
                    if (userInfo && bcrypt.compareSync(req.body.password, userInfo.password)) {
                        const token = jwt.sign({
                            id: userInfo._id
                        }, req.app.get('secretKey'), {
                            /*expiresIn: '1h'*/
                        });
                        res.status(200).json({
                            status: "success",
                            message: "user found",
                            data: {
                                user: userInfo,
                                token: token
                            }
                        });
                    } else {
                        res.status(400).json({
                            status: "error",
                            message: "Invalid login",
                            data: null
                        });
                    }
                }
            });
        }
    }
}
