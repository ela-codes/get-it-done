import { format } from 'date-fns'

export function getTodaysDate() {
    const dateInput = document.querySelector('input[name="new-date"]');
    dateInput.value = format(Date.now(), 'yyyy-MM-dd');
}

function showNewTask(currTask) {
    
    const createNewTaskLine = () => {
        const div = document.createElement('div');
        div.setAttribute('class', currTask.currID)
        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('class', 'active-cb');
        input.setAttribute('value', currTask.currTitle);
        input.setAttribute('id', currTask.currID);
        input.checked = currTask.currStatus;

        const label = document.createElement('label');
        label.setAttribute('for', currTask.currID);
        label.innerHTML = currTask.currTitle

        const span = document.createElement('span');
        span.setAttribute('class', 'due-date');
        span.innerHTML = currTask.currDueDate;

        const delBtn = document.createElement('button');
        delBtn.setAttribute('class', 'delete-task');
        delBtn.setAttribute('id', currTask.currID);
        delBtn.innerHTML = 'X';

        div.append(input, label, span, delBtn);
        return div
    }

    const listOnScreen = document.querySelector('.checklist.active');
    listOnScreen.append(createNewTaskLine());

}

export function loadNewTasks(list) {
    for (let task of list.allTasks) {
        if (task.displayedStatus === false) {
            showNewTask(task);
        }
    }
}

export function loadOldTasks(list) {
    for (let task of list.allTasks) {
        showNewTask(task);
    }
}


export function updateTaskDisplayStatus(task) {
    task.displayedStatus = task.displayedStatus? false : true ;
}


export function removeTaskFromUI(div) {
    div.remove()
}