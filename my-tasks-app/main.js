
/*Try to get the saved data.
If it doesn’t exist take defaults. */
let tasksData = JSON.parse(localStorage.getItem("tasksData")) || {
    "How to Use?": [
        { id: 1, name: "Click the ➕ Create New List button (bottom left) to start." },
        { id: 2, name: "Then, click 'Add a Task' to create your first task." },
        { id: 3, name: "Click ⋮ (three dots) beside any task or list to delete it." },
        { id: 4, name: "Your tasks are saved automatically — refresh safely!" }
    ]
};

// Immediately save once if localStorage was empty
if (!localStorage.getItem("tasksData")) {
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
}

// click on createNewList
function createNewListPopUPMenu() {
    let createNewListBody = document.createElement("div");
    createNewListBody.className = "createNewListBody";

    createNewListBody.innerHTML = `<div class="createNewListCont"><div class="head">Create new list</div><div class="inputListNameCont"><input type="text" id="inputListName" placeholder="Enter name" name="inputListName" required
    class="hover"></div><div class="createNewListOptions" id="createNewListOptions"><button type="button" class="cancelBtn hover cursor">Cancel</button><button class="doneBtn hover cursor">Done</button></div></div>`

    document.body.append(createNewListBody);
    return createNewListBody;
}

function createNewList(listName) {
    let cardCont = document.createElement("div");
    cardCont.className = "cardCont";

    cardCont.innerHTML = `<div class="card"><div class="cardHead"><div class="listName">${listName}</div><span class="material-symbols-outlined hover round cursor list_more_vert">more_vert</span></div>
    <div class="cardBody"><div class="addTask capsule hover cursor"><span class="material-symbols-outlined">add_task</span>Add a task</div></div></div>`

    // add list inside lists section of aside
    document.getElementById("lists").insertAdjacentHTML("beforeend", `<div class="capsule cursor hover"><span class="material-symbols-outlined symbol check_box">check_box</span>${listName}</div>`)

    //add click event to list_more_vert
    let list_more_vert = cardCont.querySelector(".list_more_vert");
    list_more_vert.addEventListener("click", () => {
        clickListMoreVertHandler(list_more_vert);
    })

    return cardCont;
}

function createNewListHandler(listName, createNewListBody) {
    let tasksCardCont = document.getElementById("tasksCardsCont")

    // add list in tasksCardCont
    let newList = createNewList(listName);
    tasksCardCont.insertAdjacentElement("beforeend", newList);

    if (!tasksData[listName]) {
        tasksData[listName] = [];
        localStorage.setItem("tasksData", JSON.stringify(tasksData));
    }

    // Attach click event to this/new card's Add Task button
    let newAddTask = newList.querySelector(".addTask");
    newAddTask.addEventListener("click", () => clickAddTaskHandler(newAddTask));

    createNewListBody.remove();
}

let createNewListBtn = document.getElementById("createNewList");
createNewListBtn.addEventListener("click", () => {
    // creates a new popUpMenu on each click
    let createNewListBody = createNewListPopUPMenu();

    let inputListName = document.getElementById("inputListName");
    inputListName.focus();
    let createNewListOptions = document.getElementById("createNewListOptions")
    let cancelBtn = createNewListOptions.querySelector(".cancelBtn");
    let doneBtn = createNewListOptions.querySelector(".doneBtn");

    cancelBtn.addEventListener("click", () => { createNewListBody.remove(); }, { once: true })

    inputListName.addEventListener("keydown", (e) => {
        console.log("inputLisName key:" + e.key)

        let listName = inputListName.value.trim();
        console.log(listName);

        if (e.key == 'Enter' && listName != '') {
            createNewListHandler(listName, createNewListBody);
            return;
        }
    })

    doneBtn.addEventListener("click", () => {
        let listName = inputListName.value.trim();
        console.log(listName);

        if (listName != '') {
            createNewListHandler(listName, createNewListBody);
            return;
        }
    })

})

// create a new TaskInputCont 
function createTaskInputContElement() {
    const taskInputCont = document.createElement("div");
    taskInputCont.className = "taskInputCont";
    taskInputCont.innerHTML = `<span class="material-symbols-outlined symbol hover round cursor check_circle">check_circle</span>
    <div class="taskInput"><input type="text" id="inputTaskName" name="taskName" placeholder="Task Name"></div>`;

    return taskInputCont;
}

function createTaskElement(taskName) {
    let task = document.createElement('div');

    task.classList.add('task', 'hover');
    task.innerHTML = `<span class="material-symbols-outlined symbol hover round cursor check_circle">check_circle</span><div class="taskNameCont"><div class="taskName">${taskName}</div><div class="options"><span class="material-symbols-outlined symbol hover cursor round task_more_vert">more_vert</span> <span class="material-symbols-outlined symbol hover cursor round task_star">star</span></div></div>`

    // add onclick event to tasks_more_vert
    let task_more_vert = task.querySelector(".task_more_vert");
    task_more_vert.addEventListener("click", () => {
        clickTasksMoreVertHandler(task_more_vert);
    })

    return task;
}

function add_task(inputTaskName, addTask, listName) {
    const taskName = inputTaskName.value.trim();

    console.log(taskName);
    if (taskName != '') {
        const task = { id: Date.now(), name: taskName };
        // in case of existing(static) taskLists, we haven't created an empty array for that list => create array at time of task addition
        if (!tasksData[listName]) tasksData[listName] = []
        tasksData[listName].push(task);
        localStorage.setItem("tasksData", JSON.stringify(tasksData));

        const taskEl = createTaskElement(taskName);
        addTask.insertAdjacentElement("afterend", taskEl);

        inputTaskName.value = '';
    }
}

function clickAddTaskHandler(addTask) {
    // create a new TaskInputCont for each click on addTask to avoid event stacking
    let taskInputCont = createTaskInputContElement();
    let listName = addTask.parentNode.parentNode.querySelector(".listName").textContent;

    addTask.insertAdjacentElement("afterend", taskInputCont);

    const inputTaskName = taskInputCont.querySelector("#inputTaskName")
    inputTaskName.focus()

    taskInputCont.style.animation = "openY 0.2s linear 0s 1";

    inputTaskName.addEventListener("keydown", (e) => {
        console.log(e);
        if (e.key == 'Enter' && inputTaskName.value.trim() != '') {
            add_task(inputTaskName, addTask, listName);
            clickAddTaskHandler(addTask);
        }
    })

    // close only on focusout
    inputTaskName.onblur = () => {
        add_task(inputTaskName, addTask, listName);
        taskInputCont.remove();
    }
}

// click on already existing static addTasks
document.querySelectorAll(".addTask").forEach(addTask => {
    addTask.addEventListener("click", () => clickAddTaskHandler(addTask));
});

// click on already existing more_verts of static tasks
document.querySelectorAll(".task_more_vert").forEach((task_more_vert) => {
    task_more_vert.addEventListener("click", () => {
        clickTasksMoreVertHandler(task_more_vert);
    })
})

// click on already existing more_verts of static lists
document.querySelectorAll(".list_more_vert").forEach((list_more_vert) => {
    list_more_vert.addEventListener("click", () => {
        clickListMoreVertHandler(list_more_vert);
    })
})

// rendering Data on Domload
function renderLocalStorageData() {
    let data = JSON.parse(localStorage.getItem("tasksData")) || {};

    for (const list in data) {
        let cardCont = createNewList(list);
        document.getElementById("tasksCardsCont").append(cardCont);

        let tasksArray = data[list];
        let addTask = cardCont.querySelector(".addTask")

        tasksArray.forEach(task => {
            addTask.insertAdjacentElement("afterend", createTaskElement(task.name));
        });

        // add onclick event listener to each addTask
        addTask.addEventListener("click", () => { clickAddTaskHandler(addTask) })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderLocalStorageData();
}, { once: true })


function createDeleteTaskCont() {
    let deleteTaskCont = document.createElement("div");
    deleteTaskCont.classList.add("deleteTaskCont", "deleteCont");

    deleteTaskCont.innerHTML = `<div class="delete hover cursor"><button type="button" class="deleteTaskBtn deleteBtn"><span class="material-symbols-outlined">delete</span>Delete</button></div>`

    return deleteTaskCont;
}

function clickTasksMoreVertHandler(task_more_vert) {
    let deleteTaskCont = createDeleteTaskCont()

    let options = task_more_vert.parentNode
    options.append(deleteTaskCont);

    let task = options.parentNode.parentNode;
    console.log(task);
    task.onmouseleave = () => { deleteTaskCont.remove(); }
    let card = task.closest(".card");

    let deleteTaskBtn = deleteTaskCont.querySelector(".deleteTaskBtn");
    deleteTaskBtn.addEventListener("click", () => {
        task.remove();// delete from DOM

        // delete from tasksData object & update localStorage
        let listName = card.querySelector(".listName").textContent;
        let taskName = task.querySelector(".taskName").textContent;

        const taskIndex = tasksData[listName].findIndex((task) => task.name == taskName)
        if (taskIndex !== -1) {
            tasksData[listName].splice(taskIndex, 1);
            localStorage.setItem("tasksData", JSON.stringify(tasksData));
        }
    })
}

function createDeleteListCont() {
    let deleteListCont = document.createElement("div");
    deleteListCont.classList.add("deleteListCont", "deleteCont");

    deleteListCont.innerHTML = `<div class="delete hover cursor"><button type="button" class="deleteListBtn deleteBtn"><span class="material-symbols-outlined">delete</span>Delete List</button></div>`

    return deleteListCont;
}

function clickListMoreVertHandler(list_more_vert) {
    let deleteListCont = createDeleteListCont()

    let cardHead = list_more_vert.parentNode
    cardHead.append(deleteListCont);

    let cardCont = cardHead.closest(".cardCont");
    console.log(cardCont);
    cardHead.onmouseleave = () => { deleteListCont.remove(); }
    let card = cardCont.querySelector(".card");

    let deleteListBtn = deleteListCont.querySelector(".deleteListBtn");
    deleteListBtn.addEventListener("click", () => {
        cardCont.remove();// delete from DOM

        // delete from tasksData object & update localStorage
        let listName = card.querySelector(".listName").textContent;
        delete tasksData[listName];
        localStorage.setItem("tasksData", JSON.stringify(tasksData));

    })
}

