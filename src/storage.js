import { List } from './list.js';
import { Task } from './task.js';

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}



export function saveListToStorage(listObj) {
    if (storageAvailable('localStorage')){
        localStorage.setItem(listObj.properListName, JSON.stringify(listObj))
        console.log(`Saved ${listObj.properListName} to storage`)
    } else {
        console.warn('Storage not available')
    }
}


export function retrieveList(listName) {
    const storedList = JSON.parse(localStorage.getItem(listName))
    const newList = List.createNew(storedList.properName)
    Object.assign(newList, storedList)
    return newList
}


export function getStoredItems(currList) {
    const list = currList
    for (let i = 0; i < list.totalLength() ; i++ ) {
        const newTask = new Task(
            list.allTasks[i].title,
            list.allTasks[i].dueDate,
            list.allTasks[i].status,
            list.allTasks[i].id,
            list.allTasks[i].displayed
        )
        Object.assign(newTask, list.allTasks[i])
        list.allTasks[i] = newTask
    } 
    
    return list
}


export function generateTaskID(listName) { 
    const length = JSON.parse(localStorage.getItem((listName))).tasks.length

    if (length === 0) { 
        return 0
    } else {
        const id = retrieveList(listName).totalLength() // using length of list as ID
        return id
    }
}


