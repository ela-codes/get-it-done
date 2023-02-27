import { Task } from './task.js';
import { List} from './list.js';
import { saveListToStorage } from './storage.js';
import { getTodaysDate, showNewTask } from './userInterface.js';

getTodaysDate()


const taskInput = document.querySelector('input[name="new-task"]')
const dateInput = document.querySelector('input[name="new-date"]')
const addBtn = document.querySelector('button.add')

addBtn.addEventListener("click", () => {
    const currTask = new Task(
        taskInput.value, 
        dateInput.value, 
        `${activeList.totalLength() + 1}`
    )
    activeList.addTask = currTask
    saveListToStorage(activeList)
    showNewTask(currTask)
})






// DEFAULT TASKS

const t1 = new Task('Read a book', '2023-02-27', '1')
const t2 = new Task('Take dog for a walk', '2023-02-27', '2')

const defaultList = new List('default')
let activeList = defaultList;

activeList.addTask = t1
activeList.addTask = t2

saveListToStorage(activeList)
console.log(activeList.totalLength())


