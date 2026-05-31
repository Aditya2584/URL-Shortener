const express = require("express")
const urlRoute = require('./routes/url')
const {connectToMongoDB} = require("./connect")
const URL = require('./models/url')
const staticRoute = require('./routes/staticRoutes')
const path = require("path")

const app = express()
const PORT = 8001

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log("MongoDB connected"));

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('view engine', "ejs")
app.set('views', path.resolve('./views'))

app.use("/url", urlRoute);

app.get("/", staticRoute)

app.get("/test", async (req, res)=>{
    const allURLs = await URL.find({});
    return res.render('home',{
        urls : allURLs,
        name: "Aditya"
    })
})

app.get('/url/:shortId', async (req, res) =>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {$push: {
        visitHistory: {
            timestamp : Date.now()
        },
    }})

    res.redirect(entry.redirectURL)
})

app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`))