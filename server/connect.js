const mongoose = require("mongoose");

// Updated the Team userId and password and the Team Database name

const connectionString = "mongodb+srv://Team5:1234@cluster0.pdc2xzl.mongodb.net/TM-T5?retryWrites=true&w=majority";

const connectDB = () => {
	return mongoose.connect(connectionString);
};

module.exports = connectDB;