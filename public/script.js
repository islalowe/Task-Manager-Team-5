// This file handles logic for GET (view tasks), POST (add a task), PATCH (toggle task as completed), and DELETE.

//const api = new APILibrary("/api/tasks");
const api = new APILibrary("http://localhost:8080/api/tasks");// local server with port 3000

// Pulling from the html
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// manage the tasks
async function loadTasks() {
    const tasks = await api.getAll(); // GET from coreHTTP
    taskList.innerHTML = ""; // empty list
  
    tasks.forEach(task => {
        const li = document.createElement("li"); // construct the li element
        li.textContent = task.name;
        
        if (task.completed) li.classList.add("completed");  // cross it out
        
        // Toggle completion status using coreHTTP function
        //todo write a message telling the user that clicking the item will do this
        li.addEventListener("click", async () => {
        await api.toggleComplete(task._id, !task.completed);
        loadTasks(); // Refresh list
        });

        // Delete button
        const del = document.createElement("button");
        //del.textContent = "Delete Task";
        del.textContent = "D";
        del.classList.add("delete-button");
        del.addEventListener("click", async (e) => {
            // Stop propogation prevents the click from toggling completion status
            e.stopPropagation();   
            await api.delete(task._id);
            loadTasks(); // Refresh list
        });

        li.appendChild(del);       // Add the delete button to the task element
        taskList.appendChild(li);  // Add the element to the list
    });
  }

  // POST
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInput.value.trim();
  if (!name) return;

  await api.request("POST", "", "", JSON.stringify({ name, completed: false }));
  taskInput.value = "";
  loadTasks();
});

// Get
document.getElementById("get-tasks-button").addEventListener("click", loadTasks);

loadTasks(); // on page load
