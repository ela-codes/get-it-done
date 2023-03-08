import { getTodaysDate, loadOldTasks, loadNewTasks, updateTaskDisplayStatus, removeTaskFromUI, toggleModal, showList, addToSidebar, toggleListDisplay, updateListHeader } from './userInterface.js';
import { saveListToStorage, getStoredItems, retrieveList, findListInStorage } from './storage.js';
import { Task, updateAllTaskID } from './task.js';
import { List, getNewList } from './list.js'

export function onWindowLoad() {
    window.onload = () => {        
        if (localStorage.length > 0) {
            buildContentOnLoad()
        } else {
            let defaultList = List.createDefault()
            console.log(`Created default list: ${defaultList}`)
            saveListToStorage(defaultList)
            buildContentOnLoad()
        }
        getTodaysDate()
    }
}

function buildContentOnLoad() {
    const storedLists = Object.keys(localStorage)
    for (let listName of storedLists) {
        const currList = getStoredItems(retrieveList(listName)) 
        showList(currList.listName, currList.properListName)
        loadOldTasks(currList)
        addToSidebar(currList.listName, currList.properListName)
        applyEventListeners(currList)
        addBtnListener()
    } 
}

function addBtnListener() {
    const addBtn = document.querySelector('button.add')

    // refresh event listener on add-task button
    const newaddBtn = addBtn.cloneNode(true)
    addBtn.parentNode.insertBefore(newaddBtn, addBtn)
    addBtn.parentNode.removeChild(addBtn)

    const activeList = retrieveList(document.querySelector('.checklist.active').classList[0])

    newaddBtn.addEventListener('click', () => {
        activeList.addTask = Task.createNew(activeList)
        saveListToStorage(activeList)
        loadNewTasks(getStoredItems(retrieveList(activeList.properListName)))
        updateTaskDisplayStatus(activeList.latestTask())
        saveListToStorage(activeList)
        applyListenerOnNewTask(activeList)
    })
}


function applyEventListeners(activeList) {

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
        let addListBtn = document.querySelector('.add-list');
        const confirm = document.querySelector('.confirm-name');
        const input = document.querySelector('input[name="new-list"]')
        const exit = document.querySelector('.exit');

        addListBtn.addEventListener('click', () => {
            toggleModal()

            exit.onclick = () => toggleModal()

            confirm.onclick = () => {
                const newList = getNewList(input.value)
                console.log(newList)
                saveListToStorage(newList)
                toggleModal()
                showList(newList.listName, newList.properListName)
                addToSidebar(newList.listName, newList.properListName)
                addBtnListener()
                addListBtn = document.querySelector('.add-list');
            }
        })
    }

    function deleteCompletedListener() {
        const btn = document.querySelector('.delete-completed')
        btn.addEventListener('click', () => {
            // check if there are any boxes checked
            // if yes, delete tasks from list and UI
            // if no, consider the button pointless. maybe play a 'cleaned' animation?
            const checkboxes = document.querySelectorAll('.active-cb')
            console.log(checkboxes)
            checkboxes.forEach(box => {
                if (box.checked) {
                    deleteTask(box, activeList)
                }
            })
        })
    }

    function switchLists() {
        let currList = document.querySelector('.checklist.active')
        const sidebarLists = document.querySelectorAll('.sidebar-item');
        
        sidebarLists.forEach(list => list.addEventListener('click', () => {
            const clickedItem = list.classList[1]

            if (currList.classList[0] !== clickedItem) {
                const newList = document.querySelector(`.${clickedItem}`)
                toggleListDisplay(currList)
                toggleListDisplay(newList)
                updateListHeader(list.innerText)
                currList = document.querySelector('.checklist.active')
                addBtnListener()
            }
        }))
    }

    checkBoxListener()
    deleteBtnListener()
    newListListener()
    deleteCompletedListener()
    switchLists()
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
    console.log(element, activeList)
    activeList.deleteTask(element.id)
    saveListToStorage(activeList)
    updateAllTaskID(activeList)
    saveListToStorage(activeList)
}