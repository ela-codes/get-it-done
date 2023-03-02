import { loadNewTasks, updateTaskDisplayStatus, removeTaskFromUI } from './userInterface.js';
import { saveListToStorage, getStoredItems } from './storage.js';
import { Task, updateAllTaskID } from './task.js';
import { activeList } from './index.js';

export function addBtnListener() {
    const addBtn = document.querySelector('button.add')

    addBtn.addEventListener("click", () => {
        activeList.addTask = Task.createNew(activeList)
        saveListToStorage(activeList)
        loadNewTasks(getStoredItems(activeList.listName))
        updateTaskDisplayStatus(activeList.latestTask())
        saveListToStorage(activeList)
        applyListenerOnNewTask(activeList)
        console.log(activeList.allTasks)
    })
}


export function applyListenersOnLoad() {

    function checkBoxListener() {
        const checkBoxes = document.querySelectorAll('.active-cb')
    
        checkBoxes.forEach(box => box.addEventListener('change', () => {
            activeList.allTasks[box.id].currStatus = box.checked
            saveListToStorage(activeList)
        }))
    }

    function deleteBtnListener() {
        const deleteBtns = document.querySelectorAll('.delete-task')
    
        deleteBtns.forEach(btn => btn.addEventListener('click', () => {
            removeTaskFromUI(btn.parentElement)
            activeList.deleteTask(btn.id)
            saveListToStorage(activeList)
            updateAllTaskID(activeList)
            saveListToStorage(activeList)
    
        }))
    }
    checkBoxListener()
    deleteBtnListener()
}


function applyListenerOnNewTask() {

    function newCheckBoxListener(taskID) {
        const box = document.querySelector(`input[id="${taskID}"]`)

        box.addEventListener('change', () => {
            activeList.allTasks[taskID].currStatus = box.checked
            saveListToStorage(activeList)
        })
    }

    function newDeleteBtnListener(taskID) {
        const btn = document.querySelector(`button[id="${taskID}"]`)

        btn.addEventListener('click', () => {
            removeTaskFromUI(btn.parentElement)
            activeList.deleteTask(btn.id)
            saveListToStorage(activeList)
            updateAllTaskID(activeList)
            saveListToStorage(activeList)

        })
    }
    newCheckBoxListener(activeList.latestTask().currID)
    newDeleteBtnListener(activeList.latestTask().currID)
}