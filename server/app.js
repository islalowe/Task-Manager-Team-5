// This is the entry point for the application
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();  // Create the express app

const connectDB = require("./connect");  // Connect to remote DB

app.use(cors());  // Allow all Cross Origin Reqests


// Middleware - this converts string files to json files
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));   // ".." is necessary because public and server are different folders


// Data model (schema)
const data = require("../tasks");


// Define a simple route
app.get("/api/tasks", async (req, res) => {
	try {
	  const tasks = await data.find(); // `data` is theTask model
	  res.status(200).json(tasks);     // Send tasks as JSON
	} catch (error) {
	  res.status(500).json({ msg: error.message });
	}
  });


// Defining a Post Route
app.post("/api/tasks", async (req, res) => {
	try {
		const newTask = await data.create ({
			name: req.body.name,
			completed: req.body.completed
		});
		res.status(201).json(newTask);
	} catch (error) {
		res.status(500).json({msg: error.message })
	}
});


// PATCH Route (for toggling completion))
app.patch("/api/tasks/:id", async (req, res) => {
	try {
		const updatedTask = await data.findByIdAndUpdate(
			req.params.id,
			{ completed: req.body.completed },
			{ new: true }
		);
		if (!updatedTask) {
			return res.status(404).json({ msg: "Task not found" });
		}
		res.status(200).json(updatedTask);
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