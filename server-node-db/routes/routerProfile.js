const express = require('express')
const router = express.Router()

/* เรียกใช้งาน model */
const { Profile } = require('../models/model')

router.post('/api/profile/register', (req, res) => {
    let account = {}
    if (req.body.profile === "Client") {
        account = {
            username: req.body.username,
            password: req.body.password,
            profile: req.body.profile,
            like: [],
            basket: []
        }
    } else {
        account = {
            username: req.body.username,
            password: req.body.password,
            profile: req.body.profile
        }
    }
    Profile.create(account)
        .then(() => {
            console.log("create account success");
            res.send(true)
        })
        .catch(() => {
            console.log("fail create account");
            res.send(false)
        })
})
router.post('/api/profile/login', (req, res) => {
    let remember = 48 * 60 * 60 * 1000  // ชั่วโมง * นาที * วินาที * 1000 (1 วินาที = 1000 มิลลิวินาที)
    let notRemember = 1 * 60 * 60 * 1000

    Profile.findOne({username : req.body.username})
        .then((user) => {
            console.log(user.username);
            req.session.userId = user._id
            req.session.username = user.username
            req.session.profile = user.profile
            req.session.cookie.maxAge = req.body.remember === true ? remember : notRemember

            if (user.profile === 'admin') {
                res.json({
                    userId : user._id,
                    username : user.username,
                    profile : user.profile
                })   
            } else {
                res.json({
                    userId : user._id,
                    username : user.username,
                    profile : user.profile,
                    like : user.like,
                    basket : user.basket
                }) 
            }
        })

})
router.get('/api/profile/sesion', (req, res) => {
    if (req.session.userId) {
        if (req.session.profile === 'admin') {
            res.json({
                userId : req.session.userId,
                username : req.session.username,
                profile : req.session.profile
            })   
        } else {
            Profile.findOne({_id: req.session.userId})
                .then((result) => {
                    res.json({
                        userId : req.session.userId,
                        username : req.session.username,
                        profile : req.session.profile,
                        like : result.like,
                        basket : result.basket
                    }) 
                })
        }
    } else {
        res.json(null)
    }
})
router.get('/api/profile/logout', (req, res) => {
    console.log("ก่อน logout : " + req.session.username);
    req.session.destroy( err => {
        if (!err) {
            res.send(true)
            console.log("หลัง logout : " + req.session);
        } else {
            res.send(false)
        }
    })
})
router.get('/api/profile/get', (req, res) => {
    Profile.find()
        .then((allAccount) => {
            res.json(allAccount)
        })
        .catch((err) => console.log(err))
})

module.exports = router