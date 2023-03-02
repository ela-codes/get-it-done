import { generateTaskID } from './storage.js';

export class Task {
    constructor(title, dueDate, status, id, displayed) {
        this.title = title;
        this.dueDate = dueDate;
        this.status = status; // false = task is not done
        this.id = id;
        this.displayed = displayed;
    }

    static createNew(activeList) {
        const taskInput = document.querySelector('input[name="new-task"]')
        const dateInput = document.querySelector('input[name="new-date"]')
        const currTask = new Task(
            taskInput.value, 
            dateInput.value,
            false,
            generateTaskID(activeList.listName),
            false
        )
        return currTask
    }

    // GETTERS
    get currTitle() {
        return this.title
    }

    get currDueDate() {
        return this.dueDate
    }

    get currStatus() {
        return this.status
    }

    get displayedStatus() {
        return this.displayed;
    }
    
    get currID() {
        return this.id;
    }

    //SETTERS
    set currTitle(newTitle) {
        this.title = newTitle
    }

    set currDueDate(newDate) {
        this.dueDate = newDate
    }
    
    /**
     * @param {boolean} newStatus
     */

    set currStatus(newStatus) {
        this.status = newStatus
    }

    set displayedStatus(newDisplayStatus) {
        this.displayed = newDisplayStatus
    }

    set currID(newID) {
        this.id = newID
    }
    
}


export function updateAllTaskID(list) {
    let idCount = 0;

    while (idCount < list.totalLength()) {
        for (let task of list.allTasks) {
            task.currID = idCount
            idCount ++
        }
    }
}