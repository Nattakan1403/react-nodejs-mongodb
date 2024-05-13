const mongoose = require("mongoose")

//เชื่อมต่อ mongoDB
const dbUrl = 'mongodb://127.0.0.1:27017/Portfolio' 
mongoose.connect(dbUrl) 
    .then(() => console.log("connect DB success."))
    .catch(() => console.log("err connect DB"))

//สร้าง Schema
let profileSchema = mongoose.Schema({
    username: String,
    password: String,
    profile: String,
    like: Array,
    basket: Array
})
let productSchema = mongoose.Schema({
    name: String,
    category: String,
    image: String,
    price: Number,
    description: String,
    detail: Array,
    tip: Array,
    Date: Date
})
let orderSchema = mongoose.Schema({
    order: Array,
    customer: String,
    totalPrice: Number,
    totalItem: Number,
    Date: Date,
    status: String,
})

//สร้าง model
let Profile = mongoose.model('profile', profileSchema)
let Product = mongoose.model('product', productSchema)
let Order = mongoose.model('order', orderSchema)

// export model
module.exports = {
    Profile: Profile,
    Product: Product,
    Order: Order
}