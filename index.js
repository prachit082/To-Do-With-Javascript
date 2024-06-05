/**
 * Represents the input element for tasks.
 * @type {HTMLInputElement}
 */
const taskInput = document.querySelector(".task-input input"),
/**
 * Represents the filter buttons.
 * @type {NodeList}
 */
filters = document.querySelectorAll(".filters span"),
/**
 * Represents the clear all button.
 * @type {HTMLElement}
 */
clearAll = document.querySelector(".clear-btn"),
/**
 * Represents the task box container.
 * @type {HTMLElement}
 */
taskBox = document.querySelector(".task-box");
/**
 * The ID of the task being edited.
 * @type {number}
 */
let editId,
/**
 * Indicates whether a task is being edited.
 * @type {boolean}
 */
isEditTask = false,
/**
 * Represents the list of todos.
 * @type {Array}
 */
todos = JSON.parse(localStorage.getItem("todo-list"));

/**
 * Adds event listeners to the filter buttons.
 * @param {HTMLElement} btn - The filter button.
 */
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

/**
 * Displays the todos based on the selected filter.
 * @param {string} filter - The selected filter.
 */
function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }

    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");

}
showTodo("all");

//i have added a task before so that shows here for test
// if you don't have any tasks no problem it isn't bug

/**
 * Displays the task menu when the ellipsis icon is clicked.
 * @param {HTMLElement} selectedTask - The selected task.
 */
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

/**
 * Updates the status of a task.
 * @param {HTMLInputElement} selectedTask - The selected task.
 */
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

/**
 * Sets the task input field for editing a task.
 * @param {number} taskId - The ID of the task.
 * @param {string} textName - The name of the task.
 */
function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

/**
 * Deletes a task.
 * @param {number} deleteId - The ID of the task to delete.
 * @param {string} filter - The current filter.
 */
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

/**
 * Clears all tasks.
 */
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

/**
 * Handles keyup event on the task input field.
 * @param {Event} e - The keyup event.
 */
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});
