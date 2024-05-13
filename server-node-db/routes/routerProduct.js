const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')

// upload file
const storage = multer.diskStorage({
    destination: function( req,file, cb) {
        cb(null, './public/image')
    },
    filename: function( req, file, cb) {
        let name1 = Math.floor(Math.random() * 99999999999999)
        cb(null, name1 + ".png")
    }
})
const upload = multer({
    storage: storage
})

// เรียกใช้งาน models
const { Product, Profile } = require('../models/model')

// router
router.post('/api/product/add', upload.single("image"), (req, res) => {
    async function editProduct() {
        let detail = (req.body.detail).split(', ')
        let tip = (req.body.tip).split(', ')
        let dete = new Date()
        let data = {
            name: req.body.name,
            category: req.body.category,
            image: "/image/" + req.file.filename,
            price: req.body.price,
            description: req.body.description,
            detail: detail,
            tip: tip,
            Date: dete
        }
        await Product.create(data)
        await Product.find()
            .then((result) => {
                res.json(result)
            })
            .catch((err) => console.log(err))
    }
    editProduct()
})
router.get('/api/product/del/:productId', (req, res) => {
    console.log(req.params.productId);
    async function delProduct() {
        await Product.deleteOne({_id: req.params.productId})
        await Product.find()
            .then((result) => {
                console.log(result);
                res.json(result)
            })
            .catch((err) => console.log(err))
    }
    delProduct()
})
router.post('/api/product/edit', upload.single("image"),(req, res) => {
    async function editProduct() {
        let detail = (req.body.detail).split(', ')
        let tip = (req.body.tip).split(', ')
        let dete = new Date()
        let data = {
            name: req.body.name,
            category: req.body.category,
            image: req.file ?  "/image/" + req.file.filename : req.body.image,
            price: req.body.price,
            description: req.body.description,
            detail: detail,
            tip: tip,
            Date: dete
        } 
        await Product.findOne({_id : req.body.productId})
            .then((result) => {
                if (req.file) {
                    fs.unlink('./public' + result.image, (err) => {
                        if(err) {console.log(err)}
                    })
                }
            })
        await Product.updateOne({_id: req.body.productId}, data)
        await Product.find()
            .then((result) => {
                res.json(result)
            })
            .catch((err) => console.log(err))
    }
    editProduct()
})
router.get('/api/product/get', (req, res) => {
    Product.find()
        .then((result) => {
            res.json(result)
        })
        .catch((err) => console.log(err))
})
router.get('/api/product/get/:productID', (req, res) => {
    let value = req.params.productID
    Product.findOne({ _id: value })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => console.log(err))
})
router.get('/api/product/newreleases', (req, res) => {
    Product.find().sort({'date': -1})
        .then((result) => {
            let Necklaces = []
            let Earrings = []
            let Bracelets = []
            let Rings = []
            let Charms = []
            for (let i = 0; i < result.length; i++) {
                if ( result[i].category === "Necklaces" && Necklaces.length <= 4 ) {
                    Necklaces.push(result[i])
                } else if (result[i].category === "Earrings" && Earrings.length <= 4 ) {
                    Earrings.push(result[i])
                } else if (result[i].category === "Bracelets" && Bracelets.length <= 4 ) {
                    Bracelets.push(result[i])
                } else if (result[i].category === "Rings" && Rings.length <= 4 ) {
                    Rings.push(result[i])
                } else if (result[i].category === "Charms" && Charms.length <= 4 ) {
                    Charms.push(result[i])
                }
            }
            res.json([{
                category: "Necklaces",
                value: Necklaces
            }, {
                category: "Earrings",
                value: Earrings
            }, {
                category: "Bracelets",
                value: Bracelets
            }, {
                category: "Rings",
                value: Rings
            }, {
                category: "Charms",
                value: Charms
            },
            ])
        })
        .catch((err) => console.log(err))
})
router.post('/api/product/action', (req, res) => { //ควรแก้ชื่อ api
    // action ในการกด like, เพิ่มสินค้าลงตะกร้า 
    async function updateAccount() {
        let action = req.body.action
        let userID = req.body.userID
        let productID = req.body.productID
        let product
        let unLike = false
        let unBasket = false

        await Product.findOne({_id : productID})
            .then((result) => {
                if (action === 'like') {
                    product = {
                        _id: result._id,
                        image: result.image,
                        name: result.name,
                        price: result.price,
                    }
                } else {
                    product = {
                        _id: result._id,
                        image: result.image,
                        name: result.name,
                        price: result.price,
                        quantity: 1
                    }
                }
            })
            .catch((err) => console.log(err))

        await Profile.findOne({_id : userID})
            .then((result) => {
                if (action === 'like') {
                    result.like.forEach(i => {
                        if (i._id == productID) {
                            unLike = true
                        }
                    });
                } else {
                    result.basket.forEach( i => {
                        if (i._id == productID) {
                            unBasket = true
                        }
                    })
                }
            })

        if (action === 'like') {
            if (unLike === true) {
                await Profile.updateOne({_id : userID}, {$pull: {"like": product}})
            } else {
                await Profile.updateOne({_id : userID}, {$push: {"like": product}})
            }
        } else {
            if (unBasket === true) {
                await Profile.updateOne({_id : userID}, {$pull: {"basket": product}})
            } else {
                await Profile.updateOne({_id : userID}, {$push: {"basket": product}})
            }
        }

        await Profile.findOne({_id : userID})
            .then((result) => {
                res.json({
                    userId : result._id,
                    username : result.username,
                    profile : result.profile,
                    like : result.like,
                    basket : result.basket
                })
            })
    }
    updateAccount()
})
router.post('/api/product/delete/basket', (req, res) => {
    async function updateBasket() {
        let delbasket = {}
        await Product.findOne({_id: req.body.productId})
            .then((result) => {
                delbasket = {
                    _id: result._id,
                    image: result.image,
                    name: result.name,
                    price: result.price,
                    quantity: result.quantity
                }
            })
        await Profile.updateOne({_id : req.body.userId}, {$pull: {"basket": delbasket}})
        await Profile.findOne({_id : req.body.userId})
            .then((result) => {
                res.json({
                    userId : result._id,
                    username : result.username,
                    profile : result.profile,
                    like : result.like,
                    basket : result.basket
                })
            })
    }
    updateBasket()
})
router.post('/api/product/upadate/quantity', (req, res) => {
    async function upadateQuantity() {
        let newBasket = []
        await Profile.findOne({ _id: req.body.userId})
            .then((result) => {
                result.basket.forEach(i => {
                    if (i._id == req.body.productId) {
                        i.quantity = req.body.quantity
                    }
                    newBasket.push(i)
                })
            })
        await Profile.updateOne({ _id: req.body.userId }, {$set: { basket : newBasket}})
        await Profile.findOne({_id : req.body.userId})
            .then((result) => {
                res.json({
                    userId : result._id,
                    username : result.username,
                    profile : result.profile,
                    like : result.like,
                    basket : result.basket
                })
            })
    }
    upadateQuantity()
})

module.exports = router