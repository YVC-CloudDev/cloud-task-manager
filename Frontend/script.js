const API_URL =
    "https://7kv7m4xsg3.execute-api.us-east-1.amazonaws.com/tasks";

const taskForm = document.querySelector(".task-form-card form");
const tasksSection = document.querySelector(".tasks-section");

let editingTaskId = null;

const titleInput = taskForm.querySelector("input");
const descriptionInput = taskForm.querySelector("textarea");
const statusSelect = taskForm.querySelector("select");
const submitButton = taskForm.querySelector("button");

loadTasks();

taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const task = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        status: statusSelect.value
    };

    try {
        if (editingTaskId) {
            task.taskId = editingTaskId;

            await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            });

            editingTaskId = null;
            submitButton.textContent = "Add Task";
        } else {
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            });
        }

        taskForm.reset();
        loadTasks();

    } catch (error) {
        console.error("Error saving task:", error);
    }
});

document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("delete-btn")) {

        const taskCard = e.target.closest(".task-card");
        const taskId = taskCard.dataset.id;

        try {
            await fetch(API_URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ taskId })
            });

            loadTasks();

        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    if (e.target.classList.contains("edit-btn")) {

        const taskCard = e.target.closest(".task-card");

        editingTaskId = taskCard.dataset.id;

        titleInput.value =
            taskCard.querySelector("h3").textContent;

        descriptionInput.value =
            taskCard.querySelector("p").textContent;

        statusSelect.value =
            taskCard.querySelector(".status").textContent;

        submitButton.textContent = "Update Task";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});

async function loadTasks() {

    try {

        tasksSection.innerHTML = "";

        const response = await fetch(API_URL);
        const tasks = await response.json();

        tasks.forEach(task => {
            createTaskCard(
                task.taskId,
                task.title,
                task.description,
                task.status
            );
        });

    } catch (error) {
        console.error("Load error:", error);
    }
}

function createTaskCard(taskId, title, description, status) {

    const taskCard = document.createElement("div");

    taskCard.classList.add("task-card");
    taskCard.dataset.id = taskId;

    taskCard.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>

        <span class="status ${getStatusClass(status)}">
            ${status}
        </span>

        <div class="task-actions">
            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>
        </div>
    `;

    tasksSection.appendChild(taskCard);
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