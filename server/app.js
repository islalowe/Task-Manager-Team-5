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
app.get("/api/tasks", async (req, res) => {
	try {
	  const tasks = await data.find(); // `data` is your Task model
	  res.status(200).json(tasks);     // Send tasks as JSON
	} catch (error) {
	  res.status(500).json({ msg: error.message });
	}
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