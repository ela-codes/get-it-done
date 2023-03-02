import { Task } from './task.js';
import { List } from './list.js';
import { saveListToStorage, getStoredItems, generateTaskID } from './storage.js';
import { getTodaysDate, loadOldTasks, loadNewTasks, updateTaskDisplayStatus, removeTaskFromUI } from './userInterface.js';


// GLOBAL VARIABLES
const defaultList = new List('Default')
let activeList = defaultList;


// ON WINDOW LOAD
window.onload = () => {
    getTodaysDate()

    if (localStorage.length > 0) {
        buildContentOnLoad()
    } else {
        saveListToStorage(activeList)
    }
}

function buildContentOnLoad() {
    const storedList = getStoredItems(activeList.listName)
    activeList = storedList
    loadOldTasks(activeList)
    checkBoxListener()
    deleteBtnListener()
    console.log(activeList.allTasks)
}



// TASK-RELATED EVENT LISTENERS
const addBtn = document.querySelector('button.add')

addBtn.addEventListener("click", () => {
    createNewTask()
    saveListToStorage(activeList)
    loadNewTasks(getStoredItems(activeList.listName))
    updateTaskDisplayStatus(activeList.latestTask())
    saveListToStorage(activeList)
    newCheckBoxListener(activeList.latestTask().currID)
    newDeleteBtnListener(activeList.latestTask().currID)
    console.log(activeList.allTasks)
})



function checkBoxListener() {
    const checkBoxes = document.querySelectorAll('.active-cb')

    checkBoxes.forEach(box => box.addEventListener('change', () => {
        activeList.allTasks[box.id].currStatus = box.checked
        saveListToStorage(activeList)
    }))
}

function newCheckBoxListener(taskID) {
    const box = document.querySelector(`input[id="${taskID}"]`)

    box.addEventListener('change', () => {
        activeList.allTasks[taskID].currStatus = box.checked
        saveListToStorage(activeList)
    })
}

function deleteBtnListener() {
    const deleteBtns = document.querySelectorAll('.delete-task')

    deleteBtns.forEach(btn => btn.addEventListener('click', () => {
        removeTaskFromUI(btn.parentElement)
        activeList.deleteTask(btn.id)
        saveListToStorage(activeList)
        updateAllTaskID()
        saveListToStorage(activeList)

    }))
}

function newDeleteBtnListener(taskID) {
    const btn = document.querySelector(`button[id="${taskID}"]`)

    btn.addEventListener('click', () => {
        removeTaskFromUI(btn.parentElement)
        activeList.deleteTask(btn.id)
        saveListToStorage(activeList)
        updateAllTaskID()
        saveListToStorage(activeList)

    })
}


// SERVICE PROVIDERS FOR INTERNAL TASK UPDATES
function createNewTask() {
    const taskInput = document.querySelector('input[name="new-task"]')
    const dateInput = document.querySelector('input[name="new-date"]')
    const currTask = new Task(
        taskInput.value, 
        dateInput.value,
        false,
        generateTaskID(activeList.listName),
        false
    )
    activeList.addTask = currTask
}

function updateAllTaskID() {
    let idCount = 0;

    while (idCount < activeList.totalLength()) {
        for (let task of activeList.allTasks) {
            task.currID = idCount
            idCount ++
        }
    }
}