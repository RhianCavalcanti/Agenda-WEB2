const express = require('express');
const router = express.Router();
const User = require('../model/user');
const mongoose = require('mongoose');

router.get("/", (req, res, next) => {
    res.sendFile(__dirname + '/index.html')
});

router.post("/", (req, res, next) => {

    User.find({mail: req.body.mail}).exec().
    then(result => {
        if (result.length >= 1)
        {
            res.status(422).json({
                message: "user already exists"
            });
        }
        else
        {
            const user_1 = new User({
                _id: mongoose.Types.ObjectId(),
                mail: req.body.mail,
                name: req.body.name,
                age: req.body.age
            });
        
            user_1.save().then(result => {
                console.log(result);
                res.status(200).json({
                    message: result
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    message: err
                });
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: err
        })
    })
});

router.put("/", (req, res, next) => {
    res.status(200).json({
        message: "hello this is user put request",
    })
});

router.patch("/", (req, res, next) => {
    res.status(200).json({
        message: "hello this is user patch request",
    })
});

router.delete("/", (req, res, next) => {
    res.status(200).json({
        message: "hello this is user delete request",
    })
});

module.exports = router;