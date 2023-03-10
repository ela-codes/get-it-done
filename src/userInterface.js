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


export function removeFromUI(div) {
    div.remove()
}

export function showList(listName, properName) {
    
    function createList() {
        const div = document.createElement('div');
        div.setAttribute('class', properName)
        div.classList.add('checklist');
        div.style.display = 'none';
        return div
    }

    updateListHeader(listName)
    
    const currDiv = document.querySelector('.checklist.active'); // on reload, this div doesnt exist
    if (currDiv !== null) {toggleListDisplay(currDiv)} 
    
    const content = document.querySelector('.content-top');
    const newDiv = createList(listName)
    content.appendChild(newDiv)
    toggleListDisplay(newDiv)

    
}


export function toggleListDisplay(div) {
    if (div.style.display === 'none') {
        div.style.display = 'grid';
        div.classList.add('active')
    } else {
        div.style.display = 'none'
        div.classList.remove('active')
    }
}

export function updateListHeader(listName) {
    const title = document.querySelector('.list-title');
    title.innerHTML = listName
}


export function toggleDeleteListBtnDisplay(listName) {
    const btn = document.querySelector('.delete-list');
    if (listName !== 'Today') {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
}


export function addToSidebar(listName, properName) {
    const sidebar = document.querySelector('.sidebar-lists');
    const list = document.createElement('div')
    list.setAttribute('class', 'sidebar-item');
    list.classList.add(properName)
    list.innerHTML = listName
    sidebar.append(list)
}


export function toggleModal() {
    const modal = document.querySelector('.modal')
    modal.style.display = modal.style.display == 'none' ? 'block' : 'none';
}

export function clearInputField(parentNode) {
    const input = parentNode.querySelector('input[type="text"]')
    input.value = ''
}


export function updateElementTaskID(activeListElement, totalTasks) {
    let num = 0;
    while (num < totalTasks) {
        for (const div of activeListElement.childNodes) {
            div.setAttribute('class', num)
            div.querySelector('input').setAttribute('id', num)
            div.querySelector('label').setAttribute('for', num)
            div.querySelector('button').setAttribute('id', num)
            num++
        }
    }
}