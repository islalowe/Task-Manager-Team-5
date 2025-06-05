class APILibrary {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  buildURL(endpoint = "", queryParams = "") {
    let url = `${this.baseURL}${endpoint}`;
    if (queryParams) {
      url += `?${queryParams}`;
    }
    return url;
  }

  async request(method, endpoint = "", queryParams = "", body = null) {
    const url = this.buildURL(endpoint, queryParams);
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      return contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch (err) {
      throw new Error(`Request failed: ${err.message}`);
    }
  }

  
  getAll() {
    return this.request("GET");
  }

  create(task) {
    return this.request("POST", "", "", task);
  }

  delete(id) {
    return this.request("DELETE", `/${id}`);
  }

  toggleComplete(id, completed) {
    return this.request("PATCH", `/${id}`, "", { completed });
  }
}

// this will point to routes defines in server/routes/tasks.js
// instantiates the class
// Sets the base URL to /api/tasks so everything else can just add endpoints after that.
const api = new APILibrary("/api/tasks");

// DOM Elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const refreshBtn = document.getElementById("get-tasks-button");

// Load and display tasks
async function loadTasks() {
  try {
    const tasks = await api.getAll();
    taskList.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.name;
      if (task.completed) li.classList.add("completed");

      // Toggle complete on click
      li.addEventListener("click", async () => {
        await api.toggleComplete(task._id, !task.completed);
        loadTasks();
      });

      // Optional delete button
      const del = document.createElement("button");
      del.textContent = "X";
      del.addEventListener("click", async (e) => {
        e.stopPropagation();
        await api.delete(task._id);
        loadTasks();
      });

      li.appendChild(del);
      taskList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load tasks:", err);
  }
}

// Add task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInput.value.trim();
  if (!name) return;

  await api.create({ name, completed: false });
  taskInput.value = "";
  loadTasks();
});

// Refresh manually
refreshBtn?.addEventListener("click", loadTasks);


loadTasks();
