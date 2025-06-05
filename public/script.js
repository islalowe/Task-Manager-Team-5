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
        const li = document.createElement("li");
      
        const text = document.createTextNode(task.name);
        li.appendChild(text);
      
        if (task.completed) li.classList.add("completed");
      
        // COMPLETE Button
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔️"; // Toggle button
        completeBtn.classList.add("complete-button");
        completeBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          await api.toggleComplete(task._id, !task.completed);
          loadTasks();
        });
      
        // DELETE Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete"; 
        deleteBtn.classList.add("delete-button");
        deleteBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          await api.delete(task._id);
          loadTasks();
        });
      
        // Append buttons
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
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
