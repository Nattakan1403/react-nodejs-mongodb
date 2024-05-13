const express = require("express")
const routerProfile = require('./routes/routerProfile')
const routerProduct = require('./routes/routerProduct')
const routerOrder = require('./routes/routerOrder')
const session = require("express-session")

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
    secret: "my-session",
    resave: false,
    saveUninitialized: false
}))

app.use(routerProfile)
app.use(routerProduct)
app.use(routerOrder)

app.listen(7000 , () => {
    console.log("server run on port 8080");
})