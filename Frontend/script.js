const taskForm = document.querySelector(".task-form-card form");
const tasksSection = document.querySelector(".tasks-section");

let editingTask = null;

if (taskForm) {
    const titleInput = taskForm.querySelector("input");
    const descriptionInput = taskForm.querySelector("textarea");
    const statusSelect = taskForm.querySelector("select");
    const submitButton = taskForm.querySelector("button");

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

        taskForm.reset();
    });
}

document.addEventListener("click", function (e) {
    const buttonText = e.target.textContent.trim();

    if (buttonText === "Delete") {
        e.target.closest(".task-card").remove();
    }

    if (buttonText === "Edit") {
        const taskCard = e.target.closest(".task-card");

        const title = taskCard.querySelector("h3").textContent;
        const description = taskCard.querySelector("p").textContent;
        const status = taskCard.querySelector(".status").textContent;

        taskForm.querySelector("input").value = title;
        taskForm.querySelector("textarea").value = description;
        taskForm.querySelector("select").value = status;
        taskForm.querySelector("button").textContent = "Update Task";

        editingTask = taskCard;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});

function getStatusClass(status) {
    if (status === "In Progress") {
        return "progress";
    }

    if (status === "Done") {
        return "done";
    }

    return "todo";
}