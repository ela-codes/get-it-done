import { getTodaysDate, loadOldTasks, loadNewTasks, updateTaskDisplayStatus, removeFromUI, toggleModal, showList, addToSidebar, toggleListDisplay, updateListHeader, clearInputField, toggleDeleteListBtnDisplay, updateElementTaskID } from './userInterface.js';
import { saveListToStorage, getStoredItems, retrieveList, removeStoredList } from './storage.js';
import { Task, updateAllTaskID } from './task.js';
import { List, getNewList } from './list.js'

export function onWindowLoad() {
    window.onload = () => {        
        if (localStorage.length > 0) {
            buildContentOnLoad()
        } else {
            let defaultList = List.createDefault()
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
        toggleDeleteListBtnDisplay(currList.properListName)
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
        // applyListenerOnNewTask()
        applyEventListeners(activeList)
        clearInputField(newaddBtn.parentNode)
    })
}


function applyEventListeners() {
    const listDOMElement = document.querySelector('.checklist.active')
    let activeList =  getStoredItems(retrieveList(listDOMElement.classList[0]))


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
            deleteTaskManager(btn, activeList) // turn deleted tasks to null
            activeList.updateListAfterTaskRemoval() // creates replacement list without null
            updateAllTaskID(activeList.allTasks) // reassign consecutive task IDs to tasks in new list
            saveListToStorage(activeList) // save changes to storage
            updateElementTaskID(listDOMElement, activeList.totalLength())
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
                saveListToStorage(newList)
                toggleModal()
                showList(newList.listName, newList.properListName)
                addToSidebar(newList.listName, newList.properListName)
                addBtnListener()
                applyEventListeners()
                toggleDeleteListBtnDisplay(newList.properListName)
                clearInputField(confirm.parentNode)
            }
        })
    }

    function deleteCompletedListener() {
        const btn = document.querySelector('.delete-completed')
        
        btn.addEventListener('click', () => {
            activeList = retrieveList(document.querySelector('.checklist.active').classList[0])
            const checkboxes = document.querySelectorAll('.active-cb')
            checkboxes.forEach(box => {
                if (box.checked) {
                    deleteTaskManager(box, activeList)
                }
            })
            activeList.updateListAfterTaskRemoval()
            updateAllTaskID(activeList.allTasks)
            saveListToStorage(activeList)
            updateElementTaskID(listDOMElement, activeList.totalLength())
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
                toggleDeleteListBtnDisplay(currList.classList[0])
            }
        }))
    }

    function deleteNewList() {
        const listDiv = document.querySelector('.checklist.active')

        if (listDiv.classList[0] !== 'Today') {
            const btn = document.querySelector('.delete-list')

            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this list?')) {
                    
                    const listSidebar = document.querySelector(`.sidebar-item.${listDiv.classList[0]}`)

                    removeStoredList(listDiv.classList[0])
                    removeFromUI(listDiv)
                    removeFromUI(listSidebar)

                    const defaultList = document.querySelector('.checklist.Today')
                    toggleListDisplay(defaultList) // go back to default list
                    updateListHeader(defaultList.classList[0]) 
                    toggleDeleteListBtnDisplay(defaultList.classList[0]) 
                    applyEventListeners()
                }
            })
        }
    }
    checkBoxListener()
    deleteBtnListener()
    newListListener()
    deleteCompletedListener()
    switchLists()
    deleteNewList()
}


function deleteTaskManager(element, activeList) {
    // element is the Dom element that triggered the event listener calling this function
    activeList.deleteTask(element.id)
    removeFromUI(element.parentElement)
    
}