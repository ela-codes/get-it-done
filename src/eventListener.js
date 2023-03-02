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
    
        deleteBtns.forEach(btn => 
            btn.addEventListener('click', () => {
            deleteTask(btn, activeList)
            })
        )
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
            deleteTask(btn, activeList)
        })
    }
    newCheckBoxListener(activeList.latestTask().currID)
    newDeleteBtnListener(activeList.latestTask().currID)
}


export function deleteCompleted() {
    const btn = document.querySelector('.delete-completed')
    btn.addEventListener('click', () => {
        // check if there are any boxes checked
        // if yes, delete tasks from list and UI
        // if no, consider the button pointless. maybe play an 'cleaned' animation?
        const checkboxes = document.querySelectorAll('.active-cb')
        console.log(checkboxes)
        checkboxes.forEach(box => {
            if (box.checked) {
                deleteTask(box, activeList)
            }
        })
    })
}


function deleteTask(element, activeList) {
    // element is the Dom element that triggered the event listener calling this function
    removeTaskFromUI(element.parentElement)
    activeList.deleteTask(element.id)
    saveListToStorage(activeList)
    updateAllTaskID(activeList)
    saveListToStorage(activeList)
}