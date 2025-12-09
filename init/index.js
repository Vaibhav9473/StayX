const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/longdata";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({}); // for delete data in database all data 
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "6936e36f5ca76179746d4872" }));
    await Listing.insertMany(initdata.data); //module.exports = { data: sampleListings };
    console.log("data was initialized");
}

initDB();