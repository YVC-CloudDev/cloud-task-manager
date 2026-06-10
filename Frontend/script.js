
const taskForm = document.querySelector(".task-form-card form");
const tasksSection = document.querySelector(".tasks-section");

let editingTask = null;

if (taskForm) {
    const titleInput = taskForm.querySelector("input");
    const descriptionInput = taskForm.querySelector("textarea");
    const statusSelect = taskForm.querySelector("select");
    const submitButton = taskForm.querySelector("button");

    loadTasks();

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = titleInput.value;
        const description = descriptionInput.value;
        const status = statusSelect.value;

        if (editingTask) {
            editingTask.querySelector("h3").textContent = title;
            editingTask.querySelector("p").textContent = description;

            const statusSpan = editingTask.querySelector(".status");
            statusSpan.textContent = status;
            statusSpan.className = "status " + getStatusClass(status);

            editingTask = null;
            submitButton.textContent = "Add Task";
        } else {
            createTaskCard(title, description, status);
        }

        saveTasks();
        taskForm.reset();
    });
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        e.target.closest(".task-card").remove();
        saveTasks();
    }

    if (e.target.classList.contains("edit-btn")) {
        const taskCard = e.target.closest(".task-card");

        taskForm.querySelector("input").value =
            taskCard.querySelector("h3").textContent;

        taskForm.querySelector("textarea").value =
            taskCard.querySelector("p").textContent;

        taskForm.querySelector("select").value =
            taskCard.querySelector(".status").textContent;

        taskForm.querySelector("button").textContent = "Update Task";

        editingTask = taskCard;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});

function createTaskCard(title, description, status) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    taskCard.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <span class="status ${getStatusClass(status)}">${status}</span>

        <div class="task-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    tasksSection.appendChild(taskCard);
}

function saveTasks() {
    const tasks = [];

    document.querySelectorAll(".task-card").forEach(task => {
        tasks.push({
            title: task.querySelector("h3").textContent,
            description: task.querySelector("p").textContent,
            status: task.querySelector(".status").textContent
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(task => {
        createTaskCard(task.title, task.description, task.status);
    });
}

function getStatusClass(status) {
    if (status === "In Progress") {
        return "progress";
    }

    if (status === "Done") {
        return "done";
    }

    return "todo";
}