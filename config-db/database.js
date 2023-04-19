const mongoose = require("mongoose");

const db_Connection = async() => {
    await mongoose.connect(process.env.DATA_BASE_URL, {
    });
        
    console.log(`database is connected`);
   
};

module.exports = db_Connection;