// This is the entry point for the application

const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./connect");  // Connect to remote DB

app.use(cors());  // Allow all Cross Origin Reqests

// Middleware - this converts string files to json files
app.use(express.json());


// Data model (schema)
const data = require("../tasks");



// Define a simple route
app.get("/tm/tasks", async (req,res)=>{
	try {
		const task = await data.find();
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(task));
		// res.status(200).json({task});   // Alternate method for sending response
	} catch {
		res.status(500).json({msg: error});
	};
});

// Connect to the database and start the appl server
const port = 8080;
const appName = "Task Manager";
(async function () {
	try {
		await connectDB();
		app.listen(port, () => {console.log(`${appName} is listening on port ${port}.`)});
	} catch (error) {
		console.log(error);
	};
})();