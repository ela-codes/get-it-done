import { getTodaysDate, loadOldTasks, loadNewTasks, updateTaskDisplayStatus, removeTaskFromUI, toggleModal, showList } from './userInterface.js';
import { saveListToStorage, getStoredItems, retrieveList } from './storage.js';
import { Task, updateAllTaskID } from './task.js';
import { defaultList } from './index.js';
import { List } from './list.js'

export function onWindowLoad() {
    window.onload = () => {        
        if (localStorage.length > 0) {
            buildContentOnLoad()
        } else {
            saveListToStorage(defaultList)
            addBtnListener(defaultList)
            applyListenersOnLoad(defaultList)
        }
        getTodaysDate()
        
    }
}

function buildContentOnLoad() {
    // always load up default list
    // might need to fix so it loads last active list
    const storedList = getStoredItems(retrieveList('Default')) 
    loadOldTasks(storedList)
    addBtnListener(storedList)
    applyListenersOnLoad(storedList)
}



function addBtnListener(activeList) {
    const addBtn = document.querySelector('button.add')

    addBtn.addEventListener("click", () => {
        activeList.addTask = Task.createNew(activeList)
        saveListToStorage(activeList)
        loadNewTasks(getStoredItems(retrieveList(activeList.listName)))
        updateTaskDisplayStatus(activeList.latestTask())
        saveListToStorage(activeList)
        applyListenerOnNewTask(activeList)

        console.log(activeList)
    })
}


function applyListenersOnLoad(activeList) {

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

    function newListListener() {
        const addListBtn = document.querySelector('.add-list');
        const confirm = document.querySelector('.confirm-name');
        const input = document.querySelector('input[name="new-list"]')
        const exit = document.querySelector('.exit');

        addListBtn.addEventListener('click', () => {
            toggleModal()

            exit.onclick = () => toggleModal()

            confirm.onclick = () => {
                console.log(JSON.stringify(activeList))
                const newList = List.createNew(input.value)
                
                saveListToStorage(newList)
                toggleModal()
                showList(newList.name)
            }
        })
    }



    function deleteCompletedListener(activeList) {
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

    checkBoxListener()
    deleteBtnListener()
    newListListener()
    deleteCompletedListener()
}


function applyListenerOnNewTask(activeList) {

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





function deleteTask(element, activeList) {
    // element is the Dom element that triggered the event listener calling this function
    removeTaskFromUI(element.parentElement)
    activeList.deleteTask(element.id)
    saveListToStorage(activeList)
    updateAllTaskID(activeList)
    saveListToStorage(activeList)
}