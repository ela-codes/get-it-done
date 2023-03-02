import { Task } from './task.js';
import { List } from './list.js';
import { saveListToStorage, getStoredItems } from './storage.js';
import { getTodaysDate, loadOldTasks } from './userInterface.js';
import { addBtnListener, applyListenersOnLoad } from './eventListener.js';


// GLOBAL VARIABLES
const defaultList = new List('Default')
export let activeList = defaultList;


// ON WINDOW LOAD
window.onload = () => {
    getTodaysDate()
    addBtnListener()

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
    applyListenersOnLoad()
    console.log(activeList.allTasks)
}