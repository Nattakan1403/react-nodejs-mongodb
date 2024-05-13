const express = require('express')
const router = express.Router()

/* เรียกใช้งาน model */
const { Profile, Order } = require('../models/model')

router.post('/api/order/create', (req, res) => {
    async function createOrder() {
        let order = {}
        await Profile.findOne({_id: req.body.userId})
            .then((result) => {
                order = {
                    order: result.basket,
                    customer: result.username,
                    totalPrice: req.body.totalPrice,
                    totalItem: req.body.totalItem,
                    Date: new Date(),
                    status: "In Progress",
                }
            })

        await Order.create(order)
        await Profile.updateOne({ _id: req.body.userId }, { basket: [] })
        await Profile.findOne({ _id: req.body.userId })
            .then((result) => {
                res.json({
                    userId : result._id,
                    username : result.username,
                    profile : result.profile,
                    like : result.like,
                    basket : result.basket,
                    order: result.order
                })
            })
    }
    createOrder()
})
router.get('/api/order/get/:username', (req, res) => {
    Order.find({customer: req.params.username})
        .then((result) => {
            res.json(result)
        })
        .catch((err) => console.log(err))
})
router.get('/api/order/get', (req, res) => {
    Order.find()
        .then((result) => {
            res.json(result)
        })
        .catch((err) => console.log(err))
})
router.post('/api/order/success', (req, res) => {
    console.log(req.body.productId);
    async function onSuccesOrder() {
        await Order.updateOne({_id: req.body.productId}, {status: "Success", Date: new Date()})
        await Order.find()
            .then((result) => {
                console.log(result);
                res.json(result)
            })
            .catch((err) => console.log(err))
    }
    onSuccesOrder()
})

module.exports = router