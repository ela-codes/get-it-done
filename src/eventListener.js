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
    contentBuilder('Today') // default list first

    for (let listName of storedLists) {
        if (listName !== 'Today') {contentBuilder(listName)} // load the rest 
    }

    function contentBuilder(listName) {
        const currList = getStoredItems(retrieveList(listName)) 
        showList(currList.listName, currList.properListName)
        loadOldTasks(currList)
        addToSidebar(currList.listName, currList.properListName)

        addBtnListenerAfterLoad() // for new tasks
        applyTaskListeners() // for existing tasks retrieved from storage

        newListListenerAfterLoad() // for new list
        applyListListeners() // for existing lists retrieved from storage

        toggleDeleteListBtnDisplay(currList.properListName)
    }
}


function newListListenerAfterLoad() {
    let addListBtn = document.querySelector('.add-list');
    
    const newListBtn = addListBtn.cloneNode(true)
    addListBtn.parentNode.insertBefore(newListBtn, addListBtn)
    addListBtn.parentNode.removeChild(addListBtn)

    newListBtn.addEventListener('click', () => {
        toggleModal()

        const confirm = document.querySelector('.confirm-name');
        const input = document.querySelector('input[name="new-list"]')
        const exit = document.querySelector('.exit');

        exit.onclick = () => toggleModal()

        confirm.onclick = () => {
            const newList = getNewList(input.value)
            saveListToStorage(newList)
            toggleModal()
            showList(newList.listName, newList.properListName)
            addToSidebar(newList.listName, newList.properListName)

            toggleDeleteListBtnDisplay(newList.properListName)
            clearInputField(confirm.parentNode)
            addBtnListenerAfterLoad()
            applyListListeners()

        }
    })
}
 

function applyListListeners() {
    // switch list
    // delete list
    let listDOMElement = document.querySelector('.checklist.active')

    function switchLists() {
        const sidebarLists = document.querySelectorAll('.sidebar-item');
        
        sidebarLists.forEach(list => list.addEventListener('click', () => {
            const clickedItem = list.classList[1]
            listDOMElement = document.querySelector('.checklist.active')
            console.log(clickedItem, listDOMElement.classList[0])

            if (listDOMElement.classList[0] !== clickedItem) {
                const newList = document.querySelector(`.${clickedItem}`)
                toggleListDisplay(listDOMElement)
                toggleListDisplay(newList)
                updateListHeader(list.innerText)
                listDOMElement = document.querySelector('.checklist.active')

                toggleDeleteListBtnDisplay(listDOMElement.classList[0])
            }
        }))
    }

    function deleteNewList() {
        const btn = document.querySelector('.delete-list')
        
        // re-create btn so event is only fired at the current one
        const newBtn = btn.cloneNode(true)
        btn.parentNode.insertBefore(newBtn, btn)
        btn.parentNode.removeChild(btn)

        newBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this list?')) {
                console.log(listDOMElement.classList[0])
                
                let listSidebar = document.querySelector(`.sidebar-item.${listDOMElement.classList[0]}`)
                listDOMElement = document.querySelector('.checklist.active')
                removeStoredList(listDOMElement.classList[0])
                removeFromUI(listDOMElement)
                removeFromUI(listSidebar)

                const defaultList = document.querySelector('.checklist.Today')
                toggleListDisplay(defaultList) // go back to default list
                updateListHeader(defaultList.classList[0]) 
                toggleDeleteListBtnDisplay(defaultList.classList[0]) 
            }
        })
        
    }
    switchLists()
    deleteNewList()
    applyTaskListeners()
    newListListenerAfterLoad()
}



function addBtnListenerAfterLoad() {
    // listen for new task and call delete & checkbox task listeners
    const addBtn = document.querySelector('button.add')

    // refresh event listener on add-task button
    const newaddBtn = addBtn.cloneNode(true)
    addBtn.parentNode.insertBefore(newaddBtn, addBtn)
    addBtn.parentNode.removeChild(addBtn)

    newaddBtn.addEventListener('click', () => {
        const listDOMElement = document.querySelector('.checklist.active')
        const currList = retrieveList(listDOMElement.classList[0])
        currList.addTask = Task.createNew(currList)
        saveListToStorage(currList)
        loadNewTasks(getStoredItems(retrieveList(currList.properListName)))
        updateTaskDisplayStatus(currList.latestTask())
        saveListToStorage(currList)
        clearInputField(newaddBtn.parentNode)
        applyTaskListeners()
    })
}


function applyTaskListeners() {
    // delete one task
    // check off task
    // delete all completed tasks
    
    let listDOMElement = document.querySelector('.checklist.active')
    let activeList =  getStoredItems(retrieveList(listDOMElement.classList[0]))

    function checkBoxListener() {
        const checkBoxes = document.querySelectorAll('.active-cb')
    
        checkBoxes.forEach(box => box.addEventListener('change', () => {
            activeList =  getStoredItems(retrieveList(listDOMElement.classList[0]))
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
    
    function deleteCompletedListener() {
        const btn = document.querySelector('.delete-completed')

        const newBtn = btn.cloneNode(true)
        btn.parentNode.insertBefore(newBtn, btn)
        btn.parentNode.removeChild(btn)
        
        newBtn.addEventListener('click', () => {
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
    checkBoxListener()
    deleteBtnListener()
    deleteCompletedListener()
}


function deleteTaskManager(element, activeList) {
    // element is the Dom element that triggered the event listener calling this function
    activeList.deleteTask(element.id)
    removeFromUI(element.parentElement)
}