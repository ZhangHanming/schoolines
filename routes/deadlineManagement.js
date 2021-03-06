var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');
var models = require("../models");

router.post("/create", function(req, res) {
    var deadline = req.body.deadline;
    if (!!deadline.userId) {
        models.User.findOne({
            where: {
                id: deadline.userId
            }
        }).then(function(user) {
            console.log(user.authToken);
            if (!!user && user.authToken == deadline.token) {
                if (!!deadline.id) {
                    models.Deadline.update(deadline, {
                        where: {
                            id: deadline.id
                        }
                    }).then(function() {
                        res.sendStatus(200);
                    })
                } else {
                    models.Deadline.create(deadline).then(function() {
                        res.sendStatus(201);
                    });
                }

            } else {
                res.sendStatus(401);
            }
        })

    } else {
        res.sendStatus(400);
    }

});

router.post("/delete", function(req, res) {
    var id = req.body.id;
    models.Deadline.findOne({
        where: {
            id: id
        },
        include: [models.User]
    }).then(function(deadline) {
        if (!!deadline) {
            if (req.body.token == deadline.User.authToken) {
                models.Deadline.destroy({
                    where: {
                        id: id
                    }
                }).then(function() {
                    res.sendStatus(200);
                })
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(400);
        }
    })
})

/* Get Deadlines given a list of module codes */
router.get("/getDeadlines", function(req, res) {
    var modules = [];
    for (i in req.query) {
        modules.push(req.query[i]);
    }

    models.sequelize.Promise.all([
        models.Deadline.findAll({
            order: [
                ['due', 'ASC']
            ],
            where: {
                module: modules,
            },
            include: [models.User]
        }),
    ]).spread(function(allDeadlines) {
        var deadlineArray = [];
        var convertDate = function(date) {
            var d = new Date(date);
            return d.getDate() + '/' + (parseInt(d.getMonth()) + 1) + '/' + d.getFullYear() + " " + ((d.getHours() > 9) ? d.getHours() : "0" + d.getHours()) + ":" +
                ((d.getMinutes() > 9) ? d.getMinutes() : "0" + d.getMinutes());
        }
        for (var deadline of allDeadlines) {
            console.log(deadline.due);
            deadlineArray.push({
                id: deadline.id,
                title: deadline.title,
                des: deadline.description,
                module: deadline.module,
                date: convertDate(deadline.due),
                contributor: deadline.User.name,
                userId: deadline.User.id
            });
        }
        res.status(200).send({
            deadlineArray: deadlineArray
        });
    });
});

module.exports = router;
