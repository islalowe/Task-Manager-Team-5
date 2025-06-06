const api = new APILibrary("http://localhost:8080/api/tasks"); 

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

      if (task.completed) {
        li.classList.add("completed");
        li.classList.add("crossed-out");
      }

      // COMPLETE Button
      const completeBtn = document.createElement("button");
      completeBtn.textContent = "✔️";
      completeBtn.classList.add("complete-button");
      completeBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await api.toggleComplete(task._id, !task.completed);
        loadTasks();
      });

      // DELETE Button
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-button");

      const icon = document.createElement("i");
      icon.classList.add("fas", "fa-trash");
      deleteBtn.appendChild(icon);

      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await api.delete(task._id);
        loadTasks();
      });

      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load tasks:", err);
  }
}

// POST (add task)
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInput.value.trim();
  if (!name) return;

  await api.create({ name, completed: false });
  taskInput.value = "";
  loadTasks();
});

//new function to update task 
// EDIT (update task)
async function editTask(taskId) {
  const newContent = prompt('Edit task:', '');
  if (!newContent) return;

  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: newContent })
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    location.reload();
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Failed to update task');
  }
}


// Manual refresh button
refreshBtn?.addEventListener("click", loadTasks);

// On page load
loadTasks();
