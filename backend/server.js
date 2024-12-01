const express = require("express")
const dotenv = require("dotenv")

dotenv.config()
const app = express()


const PORT = process.env.PORT

app.get("/", (req, res)=>{
    res.send("The app is running....")
}
)

app.listen(PORT, ()=>{
    console.log(`App is running on port : ${PORT}`)
})