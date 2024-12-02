const mongoose = require("mongoose")


function connectDB(){
    mongoose.connect(process.env.MONGOURI)
    .then(()=>console.log("Database connection successful"))
    .catch((err)=>{
        console.log(`Database connection error ${err}`)
    })
}

module.exports = connectDB