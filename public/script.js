//const api = new APILibrary("/api/tasks");
const api = new APILibrary("http://localhost:8080/api/tasks");// local server with port 3000

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

async function loadTasks() {
    const tasks = await api.request("GET", ""); // Gets from /api/tasks
    taskList.innerHTML = "";
  
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.name;
      if (task.completed) li.classList.add("completed");
      taskList.appendChild(li);
    });
  }

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
