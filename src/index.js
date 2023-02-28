import { Task } from './task.js';
import { List } from './list.js';
import { saveListToStorage, getStoredItems, generateTaskID } from './storage.js';
import { getTodaysDate, loadOldTasks, loadNewTasks, updateTaskDisplayStatus } from './userInterface.js';


const defaultList = new List('Default')
let activeList = defaultList;


// ON WINDOW LOAD
window.onload = () => {
    getTodaysDate()

    if (localStorage.length > 0) {
        buildContentonLoad()
    } else {
        saveListToStorage(activeList)
    }
}

function buildContentonLoad() {
    const storedList = getStoredItems(activeList.listName)
    loadOldTasks(storedList)
    activeList = storedList
    CheckBoxListener()
}


// TASK-RELATED EVENT LISTENERS
const addBtn = document.querySelector('button.add')

addBtn.addEventListener("click", () => {
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
    saveListToStorage(activeList)
    loadNewTasks(getStoredItems(activeList.listName))
    updateTaskDisplayStatus(currTask)
    saveListToStorage(activeList)
    CheckBoxListener()
})



function CheckBoxListener() {
    const checkBoxes = document.querySelectorAll('.active-cb')

    checkBoxes.forEach(box => box.addEventListener('change', () => {
        activeList.allTasks[box.id].currStatus = box.checked
        saveListToStorage(activeList)
    }))

}
