let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editTaskId = null;

const taskTitle = document.getElementById("taskTitle");
const taskSubject = document.getElementById("taskSubject");
const taskPriority = document.getElementById("taskPriority");
const taskDeadline = document.getElementById("taskDeadline");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

addTaskBtn.addEventListener("click", handleTaskSubmit);
searchInput.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);

function handleTaskSubmit() {
  const title = taskTitle.value.trim();
  const subject = taskSubject.value.trim();
  const priority = taskPriority.value;
  const deadline = taskDeadline.value;

  if (title === "" || subject === "" || priority === "" || deadline === "") {
    alert("Please fill all fields.");
    return;
  }

  if (editTaskId) {
    tasks = tasks.map(function(task) {
      if (task.id === editTaskId) {
        return {
          ...task,
          title: title,
          subject: subject,
          priority: priority,
          deadline: deadline
        };
      }
      return task;
    });

    editTaskId = null;
    addTaskBtn.textContent = "Add Task";
  } else {
    const newTask = {
      id: Date.now(),
      title: title,
      subject: subject,
      priority: priority,
      deadline: deadline,
      completed: false
    };

    tasks.push(newTask);
  }

  saveTasks();
  clearForm();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  const searchValue = searchInput.value.toLowerCase();

  if (searchValue !== "") {
    filteredTasks = filteredTasks.filter(function(task) {
      return (
        task.title.toLowerCase().includes(searchValue) ||
        task.subject.toLowerCase().includes(searchValue)
      );
    });
  }

  const statusValue = filterStatus.value;

  if (statusValue === "Completed") {
    filteredTasks = filteredTasks.filter(function(task) {
      return task.completed === true;
    });
  } else if (statusValue === "Pending") {
    filteredTasks = filteredTasks.filter(function(task) {
      return task.completed === false;
    });
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<div class="empty-message">No tasks found.</div>`;
    updateSummary();
    return;
  }

  filteredTasks.forEach(function(task) {
    let priorityClass = "";

    if (task.priority === "High") {
      priorityClass = "priority-high";
    } else if (task.priority === "Medium") {
      priorityClass = "priority-medium";
    } else {
      priorityClass = "priority-low";
    }

    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4";

    card.innerHTML = `
      <div class="card task-card shadow-sm ${priorityClass}">
        <div class="card-body">
          <h5 class="card-title ${task.completed ? "completed-task" : ""}">${task.title}</h5>
          <p class="mb-2"><strong>Subject:</strong> ${task.subject}</p>
          <p class="mb-2"><strong>Deadline:</strong> ${task.deadline}</p>
          <p class="mb-3">
            <span class="badge bg-dark badge-custom">${task.priority}</span>
            <span class="badge ${task.completed ? "bg-success" : "bg-secondary"} badge-custom">
              ${task.completed ? "Completed" : "Pending"}
            </span>
          </p>

          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-sm btn-success" onclick="toggleTaskStatus(${task.id})">
              ${task.completed ? "Undo" : "Complete"}
            </button>
            <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
          </div>
        </div>
      </div>
    `;

    taskList.appendChild(card);
  });

  updateSummary();
}

function toggleTaskStatus(id) {
  tasks = tasks.map(function(task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(function(task) {
    return task.id === id;
  });

  taskTitle.value = task.title;
  taskSubject.value = task.subject;
  taskPriority.value = task.priority;
  taskDeadline.value = task.deadline;

  editTaskId = id;
  addTaskBtn.textContent = "Update Task";
}

function deleteTask(id) {
  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
}

function updateSummary() {
  totalTasks.textContent = tasks.length;

  const completed = tasks.filter(function(task) {
    return task.completed === true;
  }).length;

  const pending = tasks.filter(function(task) {
    return task.completed === false;
  }).length;

  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;
}

function clearForm() {
  taskTitle.value = "";
  taskSubject.value = "";
  taskPriority.value = "";
  taskDeadline.value = "";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();